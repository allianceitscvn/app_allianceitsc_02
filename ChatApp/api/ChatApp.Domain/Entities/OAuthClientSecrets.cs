namespace ChatApp.Domain.Entities;

public class OAuthClientSecrets
{
    public Guid Id { get; set; }
    public Guid ClientId { get; set; }
    public string SecretHash { get; set; } = default!;
    public string? Alg { get; set; }
    public byte[]? Salt { get; set; }
    public int? Iterations { get; set; }
    public DateTimeOffset? NotBefore { get; set; }
    public DateTimeOffset? ExpiresAt { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; }

    public OAuthClients Client { get; set; } = default!;
}