namespace ChatApp.Application.Features.CreateMessage;

public class CreateMessageResponse
{
    public Guid MessageId { get; set; }
    public Guid ConversationId { get; set; }
    public Guid SenderId { get; set; }
    public string Content { get; set; } = null!;
    public DateTimeOffset CreatedAt { get; set; }
}