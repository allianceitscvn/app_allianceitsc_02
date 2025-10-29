using Microsoft.AspNetCore.Identity;
using WebApplication.Application.Abstractions.Services;

namespace WebApplication.Infrastructure.Services;

public class PasswordHashing : IPasswordHashing
{
    private readonly PasswordHasher<object> _hasher = new();

    public string HashPassword(string password)
    {
        return _hasher.HashPassword(null, password);
    }

    public bool VerifyPassword(string hashedPassword, string providedPassword)
    {
        var result = _hasher.VerifyHashedPassword(null, hashedPassword, providedPassword);
        return result is PasswordVerificationResult.Success;
    }
}