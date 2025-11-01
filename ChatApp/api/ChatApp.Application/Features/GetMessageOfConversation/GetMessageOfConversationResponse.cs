namespace ChatApp.Application.Features.GetMessageOfConversation;

public class GetMessageOfConversationResponse
{
    public Guid Id { get; set; }
    public Guid ConversationId { get; set; }
    public Guid SenderId { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTimeOffset SentAt { get; set; }
    public bool IsRead { get; set; }
}