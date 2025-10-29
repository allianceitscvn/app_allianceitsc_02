using ChatApp.Application.Abstractions;
using Microsoft.AspNetCore.SignalR;

namespace ChatApp.Controllers;

public class ChatHub(IGroupMembershipStore groupStore, IPresenceStore presenceStore)
    : Hub
{
    public override async Task OnConnectedAsync()
    {
        var user = Context.UserIdentifier!;
        var becameOnline = await presenceStore.AddConnectionAsync(user, Context.ConnectionId);
        var groupsOfUser = await groupStore.ListGroupsOfUserAsync(user);

        //add user back to groups
        await groupStore.AddMemberToGroupsAsync(groupsOfUser, user);
        if (becameOnline)
        {
            //notify friends that user is online
            await groupStore.UpdateUserLastActiveTimeAsync(user);
            await Clients.All.SendAsync("UserOnline", user);
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var user = Context.UserIdentifier!;
        var removed = await presenceStore.RemoveConnectionAsync(user, Context.ConnectionId);
        if (removed)
        {
            //notify friends that user is offline
            await groupStore.UpdateUserLastActiveTimeAsync(user);
            await Clients.All.SendAsync("UserOffline", user);
        }

        await base.OnDisconnectedAsync(exception);
    }

    public async Task GetUserOnline()
    {
        await presenceStore.GetOnlineUsersAsync();
    }

    public async Task SendMessageToUser(string userCode, string message)
    {
        await Clients.User(userCode).SendAsync("ReceiveMessage", Context.UserIdentifier, message);
    }

    public async Task SendMessageToGroup(string groupId, string message)
    {
        await Clients.Group(groupId).SendAsync("ReceiveGroupMessage", Context.UserIdentifier, groupId, message);
    }
}