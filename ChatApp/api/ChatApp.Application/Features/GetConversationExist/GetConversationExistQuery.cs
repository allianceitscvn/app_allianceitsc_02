using MediatR;

namespace ChatApp.Application.Features.GetConversationExist;

public class GetConversationExistQuery(Guid userOneId, Guid userTwoId) : IRequest<Guid>
{
    public Guid UserOneId { get; set; } = userOneId;
    public Guid UserTwoId { get; set; } = userTwoId;
}