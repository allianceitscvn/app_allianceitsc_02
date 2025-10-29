using ChatApp.Application.Abstractions;
using ChatApp.Contracts.Utils;
using ChatApp.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ChatApp.Application.Features.CreateClient;

public class CreateClientCommandHandler(
    ILogger<CreateClientCommandHandler> logger,
    IOAuthClientsRepository clientsRepository)
    : IRequestHandler<CreateClientCommand, CreateClientResponse>
{
    public async Task<CreateClientResponse> Handle(CreateClientCommand request, CancellationToken cancellationToken)
    {
        var existClient = await clientsRepository.GetClientByNameAsync(request.Name, cancellationToken);
        if (existClient is not null)
        {
            throw new InvalidOperationException($"Client with name {request.Name} already exists.");
        }
        
        var client = new OAuthClients
        {
            Id = GuidExtensions.CreateVersion7(),
            ClientId = GuidExtensions.CreateVersion7().ToString(),
            ClientName = request.Name,
            Scopes = request.Scopes,
            IsActive = true,
            CreatedAt = DateTimeOffset.UtcNow,
        };
        var clientSecret = new OAuthClientSecrets()
        {
            Id = GuidExtensions.CreateVersion7(),
            ClientId = client.Id,
            SecretHash = Hashing.Argon2IdHasherSecretKey(request.Secret),
            CreatedAt = DateTimeOffset.UtcNow,
            NotBefore = DateTimeOffset.UtcNow,
            ExpiresAt = request.ExpiresAt,
            IsActive = true
        };

        client.Secrets = [clientSecret];
        
        var addedClient = await clientsRepository.AddClientAsync(client, cancellationToken);
        if (!addedClient)
        {
            logger.LogError("Failed to create client {ClientName}", request.Name);
            throw new Exception("Failed to create client.");
        }
        logger.LogInformation("Client {ClientName} created successfully", request.Name);
        
        return new CreateClientResponse
        {
            ClientId = client.Id,
            ClientSecret = clientSecret.SecretHash
        };
    }
}