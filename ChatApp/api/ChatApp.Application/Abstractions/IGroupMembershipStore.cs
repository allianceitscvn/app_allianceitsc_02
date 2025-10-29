namespace ChatApp.Application.Abstractions;

public interface IGroupMembershipStore
{
    Task CreateGroupAsync(string groupId, string createdBy);
    Task AddMemberAsync(string groupId, string userCode);
    Task AddMemberToGroupsAsync(IEnumerable<string> groupIds, string userCode);
    Task RemoveMemberAsync(string groupId, string userCode);
    Task<IReadOnlyCollection<string>> ListGroupsOfUserAsync(string userCode);
    Task<IReadOnlyCollection<string>> ListMembersAsync(string groupId);
    Task<bool> GroupExistsAsync(string groupId);
    Task UpdateUserLastActiveTimeAsync(string userCode);
    void CleanUpUser();
}