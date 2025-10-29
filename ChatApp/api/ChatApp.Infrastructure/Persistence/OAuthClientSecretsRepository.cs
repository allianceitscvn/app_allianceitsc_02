using ChatApp.Application.Abstractions;
using ChatApp.Domain.Entities;

namespace ChatApp.Infrastructure.Persistence;

public class OAuthClientSecretsRepository(ChatDbContext context) : IOAuthClientSecretsRepository
{
    public async Task<bool> AddClientSecretAsync(OAuthClientSecrets clientSecret, CancellationToken cancellationToken)
    {
        await context.AddAsync(clientSecret, cancellationToken);
        var result = await context.SaveChangesAsync(cancellationToken);
        return result > 0;
    }
}