using ChatApp.Application.Abstractions;
using ChatApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Infrastructure.Persistence;

public class OAuthClientsRepository(ChatDbContext context) : IOAuthClientsRepository
{
    private readonly DbSet<OAuthClients> _clients = context.Set<OAuthClients>();
    public async Task<bool> AddClientAsync(OAuthClients client, CancellationToken cancellationToken)
    {
        await context.AddAsync(client, cancellationToken);
        var result = await context.SaveChangesAsync(cancellationToken);
        return result > 0;
    }

    public async Task<OAuthClients?> GetClientByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _clients.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
    }

    public async Task<OAuthClients?> GetClientByNameAsync(string name, CancellationToken cancellationToken)
    {
        return await _clients.FirstOrDefaultAsync(c => c.ClientName == name, cancellationToken);
    }
}