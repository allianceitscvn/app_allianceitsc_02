using System.Security.Claims;

namespace ChatApp.Application.Abstractions.Services;

public interface IJwtService
{
    string GenerateToken(string userId, string userName, string role, DateTime expiration,
        List<Claim>? extraClaims = null);
}