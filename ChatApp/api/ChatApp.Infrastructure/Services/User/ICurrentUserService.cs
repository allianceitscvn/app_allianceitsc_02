namespace ChatApp.Infrastructure.Services.User;

public interface ICurrentUserService
{
    Guid GetCurrentUserId();
}