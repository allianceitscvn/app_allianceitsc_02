using MediatR;

namespace ChatApp.Application.Features.ReadMessage;

public class ReadMessageCommand(Guid conversationId, Guid userId, Guid lastReadMessageId) : IRequest<bool>
{
    public Guid ConversationId { get; set; } = conversationId;
    public Guid UserId { get; set; } = userId;
    public Guid LastReadMessageId { get; set; } = lastReadMessageId;
}