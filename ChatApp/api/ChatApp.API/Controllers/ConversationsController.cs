using ChatApp.Application.Features.GetConversationByUser;
using ChatApp.Application.Features.GetConversationExist;
using ChatApp.Application.Features.GetMessageOfConversation;
using ChatApp.Domain.Common;
using ChatApp.Infrastructure.Services.User;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConversationsController(IMediator mediator, ICurrentUserService currentUserService) : ControllerBase
{
    [HttpGet("by-user/{userId}")]
    public async Task<IActionResult> GetConversationsByUser(Guid userId, CancellationToken cancellationToken)
    {
        var query = new GetConversationByUserQuery(userId);
        var result = await mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    [HttpPost("exists")]
    public async Task<IActionResult> CheckConversationExists([FromBody] GetConversationExistQuery query,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(query, cancellationToken);
        if (result == Guid.Empty)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpGet("{conversationId}/messages")]
    public async Task<IActionResult> GetMessagesOfConversation(Guid conversationId,
        [FromQuery] PagingRequest pagingRequest, CancellationToken cancellationToken = default)
    {
        var query = new GetMessageOfConversationQuery(conversationId, currentUserService.GetCurrentUserId(),pagingRequest);
        var result = await mediator.Send(query, cancellationToken);
        return Ok(result);
    }
}