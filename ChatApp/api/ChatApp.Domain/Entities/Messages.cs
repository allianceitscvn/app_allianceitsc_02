using ChatApp.Contracts.Utils;

namespace ChatApp.Domain.Entities;

public class Messages
{
    public Guid Id { get; set; }
    public Guid ConversationId { get; set; }
    public Guid SenderUserId { get; set; }
    public string Content { get; set; } = default!;
    public DateTimeOffset CreatedAt { get; set; }
    public bool IsEdited { get; set; }
    public DateTimeOffset? EditedAt { get; set; }
    public bool IsDeleted { get; set; }

    public Conversations Conversation { get; set; } = default!;
    public Users SenderUser { get; set; } = default!;
    public ICollection<ConversationReadState> ReadStatesPointingHere { get; set; } = new List<ConversationReadState>();

    public Messages()
    {
        CreatedAt = DateTimeOffset.UtcNow;
        Id = GuidExtensions.CreateVersion7();
    }

    public static Messages Create(Guid conversationId, Guid senderId, string content)
    {
        return new Messages
        {
            ConversationId = conversationId,
            SenderUserId = senderId,
            Content = content
        };
    }
}