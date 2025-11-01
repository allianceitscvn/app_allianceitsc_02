using ChatApp.Application.Features.GetMessageOfConversation;
using ChatApp.Domain.Common;
using ChatApp.Domain.Entities;

namespace ChatApp.Application.Abstractions;

public interface IMessageRepository
{
    Task<(int count, List<GetMessageOfConversationResponse> data)> GetMessageOfConversationAsync(Guid conversationId,
        Guid userId, PagingRequest pagingRequest, CancellationToken cancellationToken);
    Task<Messages?> GetMessageByIdAsync(Guid messageId, CancellationToken cancellationToken);
    Task<Guid> CreateMessageAsync(Messages message, CancellationToken cancellationToken);
    Task<ConversationReadState?> GetReadMessageStateAsync(Guid conversationId, Guid userId, CancellationToken cancellationToken);
    Task<bool> CreateReadMessageStateAsync(ConversationReadState readState, CancellationToken cancellationToken);
    Task<bool> UpdateReadMessageState(ConversationReadState readState, CancellationToken cancellationToken);
}