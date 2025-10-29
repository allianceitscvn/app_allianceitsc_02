using ChatApp.Application.Features.CreateClient;
using ChatApp.Application.Features.GenerateToken;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Controllers;

[ApiController]
[AllowAnonymous]
[Route("api/[controller]")]
public class AuthController(IMediator mediator) : ControllerBase
{
    [HttpPost("create-client")]
    public async Task<IActionResult> CreateClient([FromBody] CreateClientCommand request,
        CancellationToken cancellationToken)
    {
        var response = await mediator.Send(request, cancellationToken);
        return Ok(response);
    }

    [HttpPost("generate-token")]
    public async Task<IActionResult> GenerateToken([FromBody] GenerateTokenCommand request,
        CancellationToken cancellationToken)
    {
        var response = await mediator.Send(request, cancellationToken);
        return Ok(response);
    }
}