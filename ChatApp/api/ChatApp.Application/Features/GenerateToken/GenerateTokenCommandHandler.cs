using System.Security.Claims;
using ChatApp.Application.Abstractions;
using ChatApp.Application.Abstractions.Services;
using ChatApp.Application.Exceptions;
using MediatR;
using WebApplication.Application.Abstractions.Services;

namespace ChatApp.Application.Features.GenerateToken;

public class GenerateTokenCommandHandler(IJwtService jwtService, IUsersRepository usersRepository)
    : IRequestHandler<GenerateTokenCommand, GenerateTokenResponse>
{
    public async Task<GenerateTokenResponse> Handle(GenerateTokenCommand request, CancellationToken cancellationToken)
    {
        var existUser = await usersRepository.GetUserByUsernameAsync(request.UserName, cancellationToken);
        if (existUser is null)
        {
            throw new NotFoundException("User not found");
        }
        
        var claims = new List<Claim>()
        {
            new Claim("userId", existUser.Id.ToString()),
        };
        var accessToken = jwtService.GenerateToken(existUser.Id.ToString(), existUser.UserName,"", DateTime.Now.AddDays(15), claims);
        var refreshToken = jwtService.GenerateToken(existUser.Id.ToString(), existUser.UserName,"", DateTime.Now.AddDays(30), claims);
        
        return new GenerateTokenResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.Now.AddDays(15),
            User = new UserLogin
            {
                Id = existUser.Id,
                Username = existUser.UserName,
                DisplayName = existUser.DisplayName
            }
        };
    }
}