using MediatR;

namespace ChatApp.Application.Features.CreateClient;

public sealed class CreateClientCommand(string name, string[] scopes, string secret, DateTimeOffset? expiresAt)
    : IRequest<CreateClientResponse>
{
    public string Name { get; set; } = name;
    public string[] Scopes { get; set; } = scopes;
    public string Secret { get; set; } = secret;
    public DateTimeOffset ? ExpiresAt { get; set; } = expiresAt;
}

public class CreateClientResponse
{
    public Guid ClientId { get; set; }
    public string ClientSecret { get; set; } = default!;
}