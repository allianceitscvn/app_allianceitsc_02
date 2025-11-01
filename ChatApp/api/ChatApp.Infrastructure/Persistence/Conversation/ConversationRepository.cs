using ChatApp.Application.Abstractions;
using ChatApp.Application.Exceptions;
using ChatApp.Application.Features.GetConversationByUser;
using ChatApp.Application.Features.GetMessageOfConversation;
using ChatApp.Domain.Common;
using ChatApp.Domain.Entities;
using ChatApp.Domain.Enum;
using ChatApp.Domain.Views;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Infrastructure.Persistence.Conversation;

public class ConversationRepository(ChatDbContext context) : IConversationRepository
{
    public async Task<Guid> CreateConversationAsync(Conversations entity, CancellationToken cancellationToken)
    {
        var newEntity = await context.Conversations.AddAsync(entity, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        return newEntity.Entity.Id;
    }

    public async Task<bool> UpdateConversationAsync(Conversations entity, CancellationToken cancellationToken)
    {
        _ = context.Conversations.Update(entity);
        var saved = await context.SaveChangesAsync(cancellationToken);
        return saved > 0;
    }

    public async Task<bool> DeleteConversationAsync(Guid id, CancellationToken cancellationToken)
    {
        var entity = await context.Conversations.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        if (entity is null)
            return false;
        _ = context.Conversations.Remove(entity);
        var saved = await context.SaveChangesAsync(cancellationToken);
        return saved > 0;
    }

    public async Task<Conversations?> GetConversationByIdAsync(Guid id, CancellationToken cancellationToken)
        => await context.Conversations.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);

    public async Task<List<ViewMyConversations>> GetConversationByUserAsync(Guid userId,
        CancellationToken cancellationToken)
    {
        return await context.VMyConversations.Where(v => v.UserId == userId).ToListAsync(cancellationToken);
    }


    public async Task<Guid> CheckOrCreateConversationExistsAsync(Guid userOneId, Guid userTwoId,
        CancellationToken cancellationToken)
    {
        // ổn định thứ tự A|B để khóa luôn cùng một key
        var low = userOneId.CompareTo(userTwoId) < 0 ? userOneId : userTwoId;
        var high = userOneId.CompareTo(userTwoId) < 0 ? userTwoId : userOneId;

        await using var tx = await context.Database.BeginTransactionAsync(cancellationToken);

        // (tuỳ chọn) tránh chờ khoá quá lâu
        await context.Database.ExecuteSqlRawAsync("SET LOCAL lock_timeout = '5s';", cancellationToken);

        // LẤY KHÓA: khoá theo cặp A|B (tự nhả khi commit/rollback)
        await context.Database.ExecuteSqlRawAsync(@"
        SELECT pg_advisory_xact_lock(
            hashtextextended(CAST({0} AS text) || '|' || CAST({1} AS text), 0)
        );",
            low, high
        );

        var existingConversation = await context.Conversations
            .Where(c => c.CreatedByUserId == userOneId || c.CreatedByUserId == userTwoId)
            .Include(c => c.Members)
            .Where(c =>
                c.Type == ConversationType.DIRECT &&
                c.Members.Any(m => m.UserId == userOneId) &&
                c.Members.Any(m => m.UserId == userTwoId))
            .Select(c => c.Id)
            .FirstOrDefaultAsync(cancellationToken);
        if (existingConversation == Guid.Empty)
        {
            var newConversation = new Conversations
            {
                CreatedByUserId = userOneId,
                Type = ConversationType.DIRECT,
                Members = new List<ConversationMembers>
                {
                    new() { UserId = userOneId },
                    new() { UserId = userTwoId }
                }
            };

            var addedConversation = await context.Conversations.AddAsync(newConversation, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            existingConversation = addedConversation.Entity.Id;
        }

        await tx.CommitAsync(cancellationToken);
        return existingConversation;
    }
    
    public async Task<bool> CheckMemberInConversationAsync(Guid conversationId, Guid userId,
        CancellationToken cancellationToken)
    {
        var isMember =
            await context.ConversationMembers.AnyAsync(x => x.ConversationId == conversationId && x.UserId == userId,
                cancellationToken);
        return isMember;
    }

    public async Task<bool> IsMemberInConversationAsync(Guid conversationId, Guid userId, CancellationToken cancellationToken)
    {
        var isMember = await context.ConversationMembers
            .AnyAsync(cm => cm.ConversationId == conversationId && cm.UserId == userId && cm.IsActive,
                cancellationToken);
        return isMember;
    }
}