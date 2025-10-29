namespace ChatApp.Application.Abstractions;

public interface IPresenceStore
{
    // return true nếu user từ offline -> online
    Task<bool> AddConnectionAsync(string userCode, string connectionId);

    // return true nếu user vừa thành offline
    Task<bool> RemoveConnectionAsync(string userCode, string connectionId);
    Task<IReadOnlyCollection<string>> GetOnlineUsersAsync();
    Task<IReadOnlyCollection<string>> GetConnectionsOfUserAsync(string userCode);
}