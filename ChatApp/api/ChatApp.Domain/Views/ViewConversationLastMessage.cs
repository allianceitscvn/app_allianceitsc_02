namespace ChatApp.Domain.Views;

public class ViewConversationLastMessage
{
    public Guid ConversationId { get; set; }
    public Guid LastMessageId { get; set; }
    public Guid LastMessageSenderId { get; set; }
    public string LastMessageContent { get; set; } = default!;
    public DateTimeOffset LastMessageAt { get; set; }
}