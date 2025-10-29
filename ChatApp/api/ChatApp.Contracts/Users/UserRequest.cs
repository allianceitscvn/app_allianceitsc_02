namespace WebApplication.Contracts.Users;

public class UserRequest(
    string userName,
    string fullName,
    string password,
    string? email,
    string? phoneNumber,
    string? address)
{
    public required string UserName { get; set; } = userName;
    public required string FullName { get; set; } = fullName;
    public required string Password { get; set; } = password;
    public string? Email { get; set; } = email;
    public string? PhoneNumber { get; set; } = phoneNumber;
    public string? Address { get; set; } = address;
}