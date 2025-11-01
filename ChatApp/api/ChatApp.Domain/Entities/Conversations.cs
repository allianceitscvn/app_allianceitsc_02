using ChatApp.Contracts.Utils;
using ChatApp.Domain.Enum;

namespace ChatApp.Domain.Entities;

public class Conversations
{
    public Guid Id { get; set; }
    public ConversationType Type { get; set; }
    public string? Name { get; set; }
    public Guid CreatedByUserId { get; set; }
    public DateTimeOffset CreatedAt { get; set; }

    public Users CreatedByUser { get; set; }
    public ConversationMetadata? ConversationMetadata { get; set; }
    public ICollection<ConversationMembers> Members { get; set; } = new List<ConversationMembers>();
    public ICollection<Messages> Messages { get; set; } = new List<Messages>();
    
    public Conversations()
    {
        Id = GuidExtensions.CreateVersion7();
        CreatedAt = DateTimeOffset.UtcNow;
    }
}