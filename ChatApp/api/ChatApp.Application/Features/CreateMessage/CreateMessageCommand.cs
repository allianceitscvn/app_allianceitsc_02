using MediatR;

namespace ChatApp.Application.Features.CreateMessage;

public class CreateMessageCommand : IRequest<CreateMessageResponse>
{
    public Guid? ConversationId { get; set; }
    public Guid SenderId { get; set; }
    public Guid? ReceiverId { get; set; }
    public string Content { get; set; } = string.Empty;
}