using ChatApp.Application.Abstractions;
using ChatApp.Application.Exceptions;
using ChatApp.Application.Features.GetMessageOfConversation;
using ChatApp.Domain.Common;
using ChatApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Infrastructure;

public class MessageRepository(ChatDbContext context) : IMessageRepository
{
    public async Task<(int count, List<GetMessageOfConversationResponse> data)> GetMessageOfConversationAsync(
        Guid conversationId,
        Guid userId, PagingRequest pagingRequest, CancellationToken cancellationToken)
    {
        // Lấy mốc LastReadAt (nếu chưa có record thì dùng MinValue)
        var lastReadAt = await context.ConversationReadStates
            .Where(rs => rs.ConversationId == conversationId && rs.UserId == userId)
            .Select(rs => (DateTimeOffset?)rs.LastReadAt)
            .FirstOrDefaultAsync(cancellationToken) ?? DateTimeOffset.MinValue;

        var messagesQuery = context.Messages
            .Where(m => m.ConversationId == conversationId)
            .OrderByDescending(m => m.CreatedAt)
            .Select(m => new GetMessageOfConversationResponse
            {
                Id = m.Id,
                ConversationId = m.ConversationId,
                SenderId = m.SenderUserId,
                Content = m.Content,
                SentAt = m.CreatedAt,
                IsRead = m.CreatedAt <= lastReadAt
            });

        var totalCount = await messagesQuery.CountAsync(cancellationToken);
        var messages = await messagesQuery
            .Skip((pagingRequest.PageIndex - 1) * pagingRequest.PageSize)
            .Take(pagingRequest.PageSize)
            .ToListAsync(cancellationToken);

        return (totalCount, messages);
    }

    public async Task<Messages?> GetMessageByIdAsync(Guid messageId, CancellationToken cancellationToken)
    {
        return await context.Messages.FirstOrDefaultAsync(m => m.Id == messageId, cancellationToken);
    }

    public async Task<Guid> CreateMessageAsync(Messages message, CancellationToken cancellationToken)
        {
            var newMessage = await context.Messages.AddAsync(message, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            return newMessage.Entity.Id;
        }

    public async Task<ConversationReadState?> GetReadMessageStateAsync(Guid conversationId, Guid userId, CancellationToken cancellationToken)
    {
        var readState = await context.ConversationReadStates
            .FirstOrDefaultAsync(rs => rs.ConversationId == conversationId && rs.UserId == userId, cancellationToken);
        return readState;
    }

    public async Task<bool> CreateReadMessageStateAsync(ConversationReadState readState,
        CancellationToken cancellationToken)
    {
        await context.ConversationReadStates.AddAsync(readState, cancellationToken);
        var res = await context.SaveChangesAsync(cancellationToken);
        return res > 0;
    }

    public async Task<bool> UpdateReadMessageState(ConversationReadState readState, CancellationToken cancellationToken)
    {
        context.ConversationReadStates.Update(readState);
        var saved = await context.SaveChangesAsync(cancellationToken);
        return saved > 0;
    }
}