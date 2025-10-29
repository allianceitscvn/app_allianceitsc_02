namespace ChatApp.Domain.Entities;

public class Users
{
    public Guid Id { get; set; }
    public string ApplicationUserCode { get; set; } = default!;
    public string ApplicationCode { get; set; } = default!;
    public string FullName { get; set; } = default!;
    public string UserName { get; set; } = default!;
    public string EmailAddress { get; set; } = default!;
    public string DisplayName { get; set; } = default!;
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public ICollection<ConversationMembers> ConversationMembers { get; set; } = new List<ConversationMembers>();
    public ICollection<Messages> Messages { get; set; } = new List<Messages>();
    public ICollection<ConversationReadState> ConversationReadStates { get; set; } = new List<ConversationReadState>();
}