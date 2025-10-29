namespace WebApplication1.Contracts.Users;

public class UserFilter : BaseFilter
{
    public string? UserName { get; set; }
    public string? FullName { get; set; }
}