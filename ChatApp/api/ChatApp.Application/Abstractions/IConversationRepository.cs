using ChatApp.Application.Features.GetConversationByUser;
using ChatApp.Application.Features.GetMessageOfConversation;
using ChatApp.Domain.Common;
using ChatApp.Domain.Entities;
using ChatApp.Domain.Views;

namespace ChatApp.Application.Abstractions;

public interface IConversationRepository
{
    Task<Guid> CreateConversationAsync(Conversations entity, CancellationToken cancellationToken);
    Task<bool> UpdateConversationAsync(Conversations entity, CancellationToken cancellationToken);
    Task<bool> DeleteConversationAsync(Guid id, CancellationToken cancellationToken);
    Task<Conversations?> GetConversationByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<List<ViewMyConversations>> GetConversationByUserAsync(Guid userId, CancellationToken cancellationToken);
    Task<Guid> CheckOrCreateConversationExistsAsync(Guid userOneId, Guid userTwoId, CancellationToken cancellationToken);
    Task<bool> CheckMemberInConversationAsync(Guid conversationId, Guid userId, CancellationToken cancellationToken);
    Task<bool> IsMemberInConversationAsync(Guid conversationId, Guid userId, CancellationToken cancellationToken);
}