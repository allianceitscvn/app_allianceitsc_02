using System.Linq.Expressions;
using ChatApp.Application.Abstractions;
using ChatApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Infrastructure.Persistence;

public class UsersRepository(ChatDbContext context) : IUsersRepository
{
    private readonly DbSet<Users> _users = context.Set<Users>();

    public async Task<List<T>> GetListUser<T>(Expression<Func<Users, T>> selector, CancellationToken cancellationToken)
    {
        return await _users.Select(selector).ToListAsync(cancellationToken);
    }

    public async Task<Users?> GetUserByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _users.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
    }

    public async Task<Users?> GetUserByUsernameAsync(string username, CancellationToken cancellationToken)
    {
        return await _users.FirstOrDefaultAsync(u => u.UserName == username, cancellationToken);
    }
}