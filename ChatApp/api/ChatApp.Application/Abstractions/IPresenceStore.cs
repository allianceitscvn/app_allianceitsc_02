namespace ChatApp.Application.Abstractions;

public interface IPresenceStore
{
    // return true nếu user từ offline -> online
    bool AddConnection(string userId, string connectionId);

    // return true nếu user vừa thành offline
    bool RemoveConnection(string userCode, string connectionId);
    IReadOnlyCollection<string> GetOnlineUsers();
    IReadOnlyCollection<string> GetConnectionsOfUser(string userCode);
}