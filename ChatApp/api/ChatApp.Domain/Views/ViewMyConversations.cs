using ChatApp.Infrastructure.Persistence.Enum;

namespace ChatApp.Domain.Views;

public class ViewMyConversations
{
    public Guid UserId { get; set; }
    public Guid ConversationId { get; set; }
    public ConversationType ConversationType { get; set; }
    public string TitleByMember { get; set; } = default!;
    public Guid? LastMessageId { get; set; }
    public string? LastMessageContent { get; set; }
    public DateTimeOffset? LastMessageAt { get; set; }
    public string? LastMessageSenderDisplayName { get; set; }
    public long UnreadCount { get; set; }
}