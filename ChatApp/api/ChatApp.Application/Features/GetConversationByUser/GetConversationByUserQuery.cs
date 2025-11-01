using ChatApp.Domain.Views;
using MediatR;

namespace ChatApp.Application.Features.GetConversationByUser;

public class GetConversationByUserQuery(Guid userId) : IRequest<List<ViewMyConversations>>
{
    public Guid UserId { get; set; } = userId;
}