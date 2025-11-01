using System.Text.Json.Serialization;

namespace ChatApp.Domain.Enum;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ConversationType
{
    /// <summary>
    /// one-on-one conversation
    /// </summary>
    DIRECT,
    
    /// <summary>
    /// multi-user conversation
    /// </summary>
    GROUP,
    /// <summary>
    /// conversation involving external participants
    /// </summary>
    EXTERNAL_GROUP
}