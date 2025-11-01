using Microsoft.AspNetCore.SignalR;

namespace ChatApp.Infrastructure.Persistence;

public class AppUserCodeProvider : IUserIdProvider
{
    public string? GetUserId(HubConnectionContext connection)
    => connection.User?.FindFirst("userId")?.Value;
            
}
    