using ChatApp.Application.Abstractions;
using ChatApp.Domain.Views;
using MediatR;

namespace ChatApp.Application.Features.GetConversationByUser;

public class GetConversationByUserQueryHandler(IConversationRepository conversationRepository) : IRequestHandler<GetConversationByUserQuery, List<ViewMyConversations>>
{
    public async Task<List<ViewMyConversations>> Handle(GetConversationByUserQuery request, CancellationToken cancellationToken)
    {
        return await conversationRepository.GetConversationByUserAsync(request.UserId, cancellationToken);
    }
}