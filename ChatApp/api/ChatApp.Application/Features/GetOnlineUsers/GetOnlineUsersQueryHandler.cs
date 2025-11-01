using ChatApp.Application.Abstractions;
using MediatR;

namespace ChatApp.Application.Features.GetOnlineUsers;

public class GetOnlineUsersQueryHandler(IUsersRepository usersRepository, IPresenceStore presenceStore)
    : IRequestHandler<GetOnlineUsersQuery, List<GetOnlineUsersResponse>>
{
    public async Task<List<GetOnlineUsersResponse>> Handle(GetOnlineUsersQuery request,
        CancellationToken cancellationToken)
    {
        var users = await usersRepository.GetListUser(u => new GetOnlineUsersResponse
        {
            Id = u.Id,
            ApplicationUserCode = u.ApplicationUserCode,
            ApplicationCode = u.ApplicationCode,
            FullName = u.FullName,
            UserName = u.UserName,
            EmailAddress = u.EmailAddress,
            DisplayName = u.DisplayName,
            IsOnline = false
        }, cancellationToken);

        var usersOnline = presenceStore.GetOnlineUsers();

        users.ForEach(u => u.IsOnline = usersOnline.Contains(u.Id.ToString()));
        return users.Where(u => u.Id != request.CurrentUserId).ToList();
    }
}