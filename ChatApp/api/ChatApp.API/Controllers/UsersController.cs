using ChatApp.Application.Features.GetOnlineUsers;
using ChatApp.Infrastructure.Services.User;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(IMediator mediator, ICurrentUserService currentUserService) : ControllerBase
{
    [HttpGet("online")]
    public async Task<IActionResult> GetOnlineUsers()
    {
        var query = new GetOnlineUsersQuery(currentUserService.GetCurrentUserId());
        var onlineUsers = await mediator.Send(query);
        return Ok(onlineUsers);
    }
}