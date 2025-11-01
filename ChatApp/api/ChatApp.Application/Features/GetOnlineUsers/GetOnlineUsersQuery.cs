using MediatR;

namespace ChatApp.Application.Features.GetOnlineUsers;

public class GetOnlineUsersQuery(Guid currentUserId) : IRequest<List<GetOnlineUsersResponse>>
{
    public Guid CurrentUserId { get; set; } = currentUserId;
}