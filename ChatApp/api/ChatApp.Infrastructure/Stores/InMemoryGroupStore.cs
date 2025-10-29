using ChatApp.Application.Abstractions;

namespace ChatApp.Infrastructure.Stores;

public class InMemoryGroupStore : IGroupMembershipStore
{
    private readonly object _lock = new();
    private readonly Dictionary<string, HashSet<string>> _groupToUsers = new();
    private readonly Dictionary<string, HashSet<string>> _userToGroups = new();
    private readonly Dictionary<string, DateTimeOffset> _userLastActiveTime = new();

    public Task CreateGroupAsync(string groupId, string createdBy)
    {
        lock (_lock)
        {
            return Task.FromResult(_groupToUsers.TryAdd(groupId, new HashSet<string>()));
        }
    }

    public Task AddMemberAsync(string groupId, string userCode)
    {
        lock (_lock)
        {
            if (!_groupToUsers.TryGetValue(groupId, out var users))
                _groupToUsers[groupId] = users = new HashSet<string>();
            users.Add(userCode);

            if (!_userToGroups.TryGetValue(userCode, out var groups))
                _userToGroups[userCode] = groups = new HashSet<string>();
            groups.Add(groupId);
        }

        return Task.CompletedTask;
    }

    public Task AddMemberToGroupsAsync(IEnumerable<string> groupIds, string userCode)
    {
        lock (_lock)
        {
            foreach (var groupId in groupIds) AddMemberAsync(groupId, userCode);
        }

        return Task.CompletedTask;
    }

    public Task RemoveMemberAsync(string groupId, string userCode)
    {
        lock (_lock)
        {
            if (_groupToUsers.TryGetValue(groupId, out var users))
                users.Remove(userCode);
            if (_userToGroups.TryGetValue(userCode, out var groups))
                groups.Remove(groupId);
        }

        return Task.CompletedTask;
    }

    public Task<IReadOnlyCollection<string>> ListGroupsOfUserAsync(string userCode)
    {
        lock (_lock)
        {
            if (_userToGroups.TryGetValue(userCode, out var groups))
                return Task.FromResult((IReadOnlyCollection<string>)groups.ToList());
            return Task.FromResult((IReadOnlyCollection<string>)Array.Empty<string>());
        }
    }

    public Task<IReadOnlyCollection<string>> ListMembersAsync(string groupId)
    {
        lock (_lock)
        {
            if (_groupToUsers.TryGetValue(groupId, out var users))
                return Task.FromResult((IReadOnlyCollection<string>)users.ToList());
            return Task.FromResult((IReadOnlyCollection<string>)Array.Empty<string>());
        }
    }

    public Task<bool> GroupExistsAsync(string groupId)
    {
        lock (_lock)
        {
            return Task.FromResult(_groupToUsers.ContainsKey(groupId));
        }
    }

    public Task UpdateUserLastActiveTimeAsync(string userCode)
    {
        lock (_lock)
        {
            _userLastActiveTime[userCode] = DateTime.UtcNow;
        }

        return Task.CompletedTask;
    }

    public void CleanUpUser()
    {
        lock (_lock)
        {
            var userLastActiveThreshold = DateTime.UtcNow.AddMinutes(-15);
            var inactiveUsers = _userLastActiveTime
                .Where(kv => kv.Value < userLastActiveThreshold)
                .Select(kv => kv.Key)
                .ToList();

            foreach (var user in inactiveUsers)
            {
                if (_userToGroups.TryGetValue(user, out var groups))
                    foreach (var groupId in groups)
                        if (_groupToUsers.TryGetValue(groupId, out var users))
                            users.Remove(user);

                _userToGroups.Remove(user);
                _userLastActiveTime.Remove(user);
            }
        }
    }
}