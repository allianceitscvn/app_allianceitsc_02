using ChatApp.Domain.Entities;

namespace ChatApp.Application.Abstractions;

public interface IUsersRepository
{
    Task<Users?> GetUserByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<Users?> GetUserByUsernameAsync(string username, CancellationToken cancellationToken);
}