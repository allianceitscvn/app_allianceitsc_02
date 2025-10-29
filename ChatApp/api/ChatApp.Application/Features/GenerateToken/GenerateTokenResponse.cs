namespace ChatApp.Application.Features.GenerateToken;

public class GenerateTokenResponse
{
    public string AccessToken { get; set; } = default!;
    public DateTimeOffset ExpiresAt { get; set; }
    public string RefreshToken { get; set; } = default!;
}