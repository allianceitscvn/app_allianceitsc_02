using MediatR;

namespace ChatApp.Application.Features.GenerateToken;

public class GenerateTokenCommand : IRequest<GenerateTokenResponse>
{
    public string UserName { get; set; } = default!;
}