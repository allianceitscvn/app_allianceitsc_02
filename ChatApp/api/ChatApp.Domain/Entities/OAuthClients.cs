namespace ChatApp.Domain.Entities;

public class OAuthClients
{
    public Guid Id { get; set; }
    public string ClientId { get; set; } = default!;
    public string ClientName { get; set; } = default!;
    public string[] Scopes { get; set; } = Array.Empty<string>();
    public bool IsActive { get; set; } = true;

    public string[]?
        IpAllowlist { get; set; } // map CIDR[] -> text[] (đơn giản hoá O/R); hoặc dùng NpgsqlTypes.NpgsqlCidr?

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? LastUsedAt { get; set; }
    public Guid? CreatedByUserId { get; set; }

    public Users? CreatedByUser { get; set; }
    public ICollection<OAuthClientSecrets> Secrets { get; set; } = new List<OAuthClientSecrets>();
}