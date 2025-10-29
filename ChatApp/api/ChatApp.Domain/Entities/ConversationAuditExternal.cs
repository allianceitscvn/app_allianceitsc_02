using System.Text.Json;

namespace ChatApp.Domain.Entities;

public class ConversationAuditExternal
{
    public Guid Id { get; set; }
    public Guid? ConversationId { get; set; }
    public string ExternalSystemName { get; set; } = default!;
    public string? RequestedBy { get; set; }
    public JsonDocument PayloadSnapshot { get; set; } = JsonDocument.Parse("{}");
    public DateTimeOffset CreatedAt { get; set; }

    public Conversations? Conversation { get; set; }
}