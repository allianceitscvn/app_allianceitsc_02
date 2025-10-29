using ChatApp.Domain.Entities;

namespace ChatApp.Application.Abstractions;

public interface IOAuthClientsRepository
{
    Task<bool> AddClientAsync(OAuthClients client, CancellationToken cancellationToken);
    Task<OAuthClients?> GetClientByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<OAuthClients?> GetClientByNameAsync(string name, CancellationToken cancellationToken);
}