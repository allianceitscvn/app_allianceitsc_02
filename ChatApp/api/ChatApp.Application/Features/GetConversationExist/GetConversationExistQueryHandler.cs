using ChatApp.Application.Abstractions;
using MediatR;

namespace ChatApp.Application.Features.GetConversationExist;

public class GetConversationExistQueryHandler(IConversationRepository conversationRepository)
    : IRequestHandler<GetConversationExistQuery, Guid>
{
    public async Task<Guid> Handle(GetConversationExistQuery request, CancellationToken cancellationToken)
    {
        return await conversationRepository.CheckOrCreateConversationExistsAsync(request.UserOneId, request.UserTwoId,
            cancellationToken);
    }
}