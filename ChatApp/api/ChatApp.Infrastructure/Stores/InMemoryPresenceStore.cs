using ChatApp.Application.Abstractions;

namespace ChatApp.Infrastructure.Stores;

public class InMemoryPresenceStore : IPresenceStore
{
    private readonly object _lock = new();
    private readonly Dictionary<string, HashSet<string>> _userToConns = new();

    public Task<bool> AddConnectionAsync(string userCode, string connectionId)
    {
        lock (_lock)
        {
            if (!_userToConns.TryGetValue(userCode, out var set))
                _userToConns[userCode] = set = new HashSet<string>();
            var wasEmpty = set.Count == 0;
            set.Add(connectionId);
            return Task.FromResult(wasEmpty); // nếu trước đó 0 -> giờ >0 => vừa online
        }
    }

    public Task<bool> RemoveConnectionAsync(string userCode, string connectionId)
    {
        lock (_lock)
        {
            if (_userToConns.TryGetValue(userCode, out var set))
            {
                set.Remove(connectionId);
                if (set.Count == 0)
                {
                    _userToConns.Remove(userCode);
                    return Task.FromResult(true); // vừa offline
                }
            }

            return Task.FromResult(false);
        }
    }

    public Task<IReadOnlyCollection<string>> GetOnlineUsersAsync()
    {
        lock (_lock)
        {
            return Task.FromResult((IReadOnlyCollection<string>)_userToConns.Keys.ToList());
        }
    }

    public Task<IReadOnlyCollection<string>> GetConnectionsOfUserAsync(string userCode)
    {
        lock (_lock)
        {
            if (_userToConns.TryGetValue(userCode, out var set))
                return Task.FromResult((IReadOnlyCollection<string>)set.ToList());
            return Task.FromResult((IReadOnlyCollection<string>)Array.Empty<string>());
        }
    }
}