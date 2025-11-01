using ChatApp.Application.Abstractions;
using MediatR;

namespace ChatApp.Application.Features.DeleteConversation;

public class DeleteConversationCommandHandler(IConversationRepository conversationRepository)
    : IRequestHandler<DeleteConversationCommand, bool>
{
    public async Task<bool> Handle(DeleteConversationCommand request, CancellationToken cancellationToken)
    {
        return await conversationRepository.DeleteConversationAsync(request.ConversationId, cancellationToken);
    }
}