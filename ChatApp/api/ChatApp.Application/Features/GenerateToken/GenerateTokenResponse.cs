namespace ChatApp.Application.Features.GenerateToken;

public class GenerateTokenResponse
{
    public string AccessToken { get; set; } = default!;
    public DateTimeOffset ExpiresAt { get; set; }
    public string RefreshToken { get; set; } = default!;
    public UserLogin User { get; set; } = default!;
}

public class UserLogin
{
    public Guid Id { get; set; }
    public string Username { get; set; } = default!;
    public string DisplayName { get; set; } = default!;
}