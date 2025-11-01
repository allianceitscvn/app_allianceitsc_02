namespace ChatApp.Domain.Entities;

public class ConversationMembers
{
    public Guid ConversationId { get; set; }
    public Guid UserId { get; set; }
    public DateTimeOffset JoinedAt { get; set; }
    public bool IsActive { get; set; } = true;

    public Conversations Conversation { get; set; } = default!;
    public Users User { get; set; } = default!;

    public ConversationMembers()
    {
        JoinedAt = DateTimeOffset.UtcNow;
    }
}