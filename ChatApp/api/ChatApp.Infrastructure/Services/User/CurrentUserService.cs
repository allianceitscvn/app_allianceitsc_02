using Microsoft.AspNetCore.Http;

namespace ChatApp.Infrastructure.Services.User;

public class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
{
    public Guid GetCurrentUserId()
    {
        var userIdString = httpContextAccessor.HttpContext?.User
            .FindFirst("userId")?.Value;

        if (Guid.TryParse(userIdString, out var userId))
        {
            return userId;
        }

        throw new InvalidOperationException("User ID not found in the current context.");
    }
}