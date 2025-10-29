namespace ChatApp.Domain.Entities;

public class ConversationReadState
{
    public Guid ConversationId { get; set; }
    public Guid UserId { get; set; }
    public Guid? LastReadMessageId { get; set; }
    public DateTimeOffset LastReadAt { get; set; }

    public Conversations Conversation { get; set; } = default!;
    public Users User { get; set; } = default!;
    public Messages? LastReadMessage { get; set; }
}