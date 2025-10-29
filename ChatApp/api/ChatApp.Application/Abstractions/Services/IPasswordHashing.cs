namespace WebApplication.Application.Abstractions.Services;

public interface IPasswordHashing
{
    string HashPassword(string password);
    bool VerifyPassword(string hashedPassword, string providedPassword);
}