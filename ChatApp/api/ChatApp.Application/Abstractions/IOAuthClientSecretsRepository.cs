using ChatApp.Domain.Entities;

namespace ChatApp.Application.Abstractions;

public interface IOAuthClientSecretsRepository
{
    Task<bool> AddClientSecretAsync(OAuthClientSecrets clientSecret, CancellationToken cancellationToken);
}