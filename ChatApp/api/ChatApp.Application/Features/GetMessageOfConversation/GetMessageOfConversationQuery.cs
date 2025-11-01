using ChatApp.Domain.Common;
using MediatR;

namespace ChatApp.Application.Features.GetMessageOfConversation;

public class GetMessageOfConversationQuery(Guid conversationId, Guid userId, PagingRequest pagingRequest) : IRequest<PagingResponse<GetMessageOfConversationResponse>>
{
    public Guid ConversationId { get; set; } = conversationId;
    public Guid UserId { get; set; } = userId;
    public PagingRequest PagingRequest { get; set; } = pagingRequest;
}