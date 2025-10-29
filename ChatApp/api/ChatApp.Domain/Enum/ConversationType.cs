using System.Text.Json.Serialization;

namespace ChatApp.Infrastructure.Persistence.Enum;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ConversationType
{
    DIRECT,
    GROUP,
    EXTERNAL_GROUP
}