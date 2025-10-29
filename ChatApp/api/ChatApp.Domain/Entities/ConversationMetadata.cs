using System.Text.Json;

namespace ChatApp.Domain.Entities;

public class ConversationMetadata
{
    public Guid ConversationId { get; set; }
    public JsonDocument Metadata { get; set; } = JsonDocument.Parse("{}");

    public Conversations Conversation { get; set; } = default!;
}