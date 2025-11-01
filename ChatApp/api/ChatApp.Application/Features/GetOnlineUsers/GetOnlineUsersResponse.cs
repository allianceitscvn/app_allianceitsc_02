namespace ChatApp.Application.Features.GetOnlineUsers;

public class GetOnlineUsersResponse
{
    public Guid Id { get; set; }
    public string ApplicationUserCode { get; set; } = default!;
    public string ApplicationCode { get; set; } = default!;
    public string FullName { get; set; } = default!;
    public string UserName { get; set; } = default!;
    public string EmailAddress { get; set; } = default!;
    public string DisplayName { get; set; } = default!;
    public bool IsOnline { get; set; } = true;
}