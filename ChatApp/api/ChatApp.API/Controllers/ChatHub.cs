using System.Runtime.InteropServices.ComTypes;
using ChatApp.Application.Abstractions;
using ChatApp.Application.Features.CreateMessage;
using ChatApp.Application.Features.ReadMessage;
using ChatApp.Infrastructure.Services.User; // cần có ConversationId trong command
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace ChatApp.Controllers;

public class ChatHub(
    IGroupMembershipStore groupStore,
    IPresenceStore presenceStore,
    IMediator mediator,
    IConversationRepository conversationRepository,
    ICurrentUserService currentUserService)
    : Hub
{
    public override async Task OnConnectedAsync()
    {
        var userId = Context.UserIdentifier!;
        var becameOnline = presenceStore.AddConnection(userId, Context.ConnectionId);

        // 1) Join personal group để nhận bump/unread/presence
        await Groups.AddToGroupAsync(Context.ConnectionId, $"User::{userId}");

        // 2) (Tuỳ chỉnh) Join lại các phòng đang theo dõi (nếu bạn lưu state bên server)
        //    Hoặc chỉ join khi client thật sự mở room (qua JoinConversation).
        var conversationIds = await groupStore.ListGroupsOfUserAsync(userId);
        foreach (var conv in conversationIds)
            await Groups.AddToGroupAsync(Context.ConnectionId, conv.ToString());

        if (becameOnline)
        {
            await groupStore.UpdateUserLastActiveTimeAsync(userId);
            // Có thể chỉ notify cho bạn bè hoặc người cùng phòng; demo thì All
            await Clients.All.SendAsync("UserOnline", userId);
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.UserIdentifier!;
        var removed = presenceStore.RemoveConnection(userId, Context.ConnectionId);
        if (removed)
        {
            await groupStore.UpdateUserLastActiveTimeAsync(userId);
            await Clients.All.SendAsync("UserOffline", userId);
        }

        await base.OnDisconnectedAsync(exception);
    }

    // Trả về danh sách online (để client tự dùng); tránh void
    public Task<IReadOnlyCollection<string>> GetUserOnline()
        => Task.FromResult(presenceStore.GetOnlineUsers());

    // Client gọi khi mở/đóng 1 room
    public async Task JoinConversation(Guid conversationId)
    {
        var isMember =
            await conversationRepository.CheckMemberInConversationAsync(conversationId,
                Guid.Parse(Context.UserIdentifier!), default);
        if (!isMember) throw new HubException("Not a member of this conversation.");

        await Groups.AddToGroupAsync(Context.ConnectionId, conversationId.ToString());

        //add to group store
        await groupStore.AddMemberAsync(conversationId.ToString(), Context.UserIdentifier!);
        await Clients.Caller.SendAsync("JoinedConversation", conversationId);
    }

    public async Task LeaveConversation(Guid conversationId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, conversationId.ToString());
        await Clients.Caller.SendAsync("LeftConversation", conversationId);
    }

    // --- GỬI TIN NHẮN: chỉ theo ConversationId ---
    public async Task SendMessage(Guid conversationId, string content)
    {
        if (string.IsNullOrWhiteSpace(content))
            throw new HubException("Message content is required.");

        // 1) Quyền: bắt buộc là member active
        var isMember = await groupStore.IsUserMemberAsync(conversationId.ToString(), Context.UserIdentifier!);
        if (!isMember) throw new HubException("Not a member of this conversation.");

        // 2) Lưu DB qua MediatR
        var cmd = new CreateMessageCommand
        {
            ConversationId = conversationId,
            SenderId = Guid.Parse(Context.UserIdentifier!),
            Content = content
        };

        var result = await mediator.Send(cmd);

        await Clients.Group(conversationId.ToString()).SendAsync("MessageCreated", result);

        // 4) Bump sidebar cho tất cả thành viên (kể cả người không mở phòng)
        var memberIds = await groupStore.ListMembersAsync(conversationId.ToString());
        foreach (var member in memberIds)
        {
            await Clients.Group($"User::{member}")
                .SendAsync("ConversationBump", new
                {
                    ConversationId = conversationId,
                    LastMessagePreview = content,
                    // Có thể kèm UnreadCount mới nếu bạn tính ở server
                    At = DateTimeOffset.UtcNow
                });
        }
    }

    // --- Typing indicators ---
    public async Task TypingStarted(Guid conversationId)
    {
        var userId = Context.UserIdentifier!;
        if (!await groupStore.IsUserMemberAsync(conversationId.ToString(), userId))
            throw new HubException("Not a member.");

        await Clients.OthersInGroup(conversationId.ToString())
            .SendAsync("TypingStarted", new { ConversationId = conversationId, UserId = userId, DisplayName = currentUserService.GetCurrentDisplayName() });
    }

    public async Task TypingStopped(Guid conversationId)
    {
        var userId = Context.UserIdentifier!;
        if (!await groupStore.IsUserMemberAsync(conversationId.ToString(), userId))
            throw new HubException("Not a member.");

        await Clients.OthersInGroup(conversationId.ToString())
            .SendAsync("TypingStopped", new { ConversationId = conversationId, UserId = userId });
    }

    public async Task MarkRead(Guid conversationId, Guid lastReadMessageId)
    {
        var userId = Guid.Parse(Context.UserIdentifier!);
        //update read state
        var isRead = await mediator.Send(new ReadMessageCommand(conversationId, userId, lastReadMessageId));
        if (isRead)
        {
            await Clients.Group(conversationId.ToString())
                .SendAsync("ReadReceiptUpdated", new
                {
                    ConversationId = conversationId,
                    UserId = userId,
                    LastReadMessageId = lastReadMessageId,
                    LastReadAt = DateTimeOffset.UtcNow
                });
        }
    }
}