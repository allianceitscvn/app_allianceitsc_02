using ChatApp.Application.Abstractions;

namespace ChatApp.Infrastructure.Stores;

public class InMemoryPresenceStore : IPresenceStore
{
    private readonly object _lock = new();
    private readonly Dictionary<string, HashSet<string>> _userToConns = new();

    public bool AddConnection(string userId, string connectionId)
    {
        lock (_lock)
        {
            if (!_userToConns.TryGetValue(userId, out var set))
                _userToConns[userId] = set = new HashSet<string>();
            var wasEmpty = set.Count == 0;
            set.Add(connectionId);
            return wasEmpty; // nếu trước đó 0 -> giờ >0 => vừa online
        }
    }

    public bool RemoveConnection(string userId, string connectionId)
    {
        lock (_lock)
        {
            if (_userToConns.TryGetValue(userId, out var set))
            {
                set.Remove(connectionId);
                if (set.Count == 0)
                {
                    _userToConns.Remove(userId);
                    return true; // vừa offline
                }
            }

            return false;
        }
    }

    public IReadOnlyCollection<string> GetOnlineUsers()
    {
        lock (_lock)
        {
            return _userToConns.Keys.ToList();
        }
    }

    public IReadOnlyCollection<string> GetConnectionsOfUser(string userId)
    {
        lock (_lock)
        {
            if (_userToConns.TryGetValue(userId, out var set))
                return set.ToList();
            return [];
        }
    }
}