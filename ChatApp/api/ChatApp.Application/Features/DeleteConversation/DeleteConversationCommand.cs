using MediatR;

namespace ChatApp.Application.Features.DeleteConversation;

public class DeleteConversationCommand(Guid conversationId) : IRequest<bool>
{
    public Guid ConversationId { get; set; } = conversationId;
}