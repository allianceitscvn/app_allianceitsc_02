using System.Linq.Expressions;
using ChatApp.Application.Features.GetOnlineUsers;
using ChatApp.Domain.Entities;

namespace ChatApp.Application.Abstractions;

public interface IUsersRepository
{
    Task<List<T>> GetListUser<T>(Expression<Func<Users, T>> selector,CancellationToken cancellationToken);
    Task<Users?> GetUserByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<Users?> GetUserByUsernameAsync(string username, CancellationToken cancellationToken);
}