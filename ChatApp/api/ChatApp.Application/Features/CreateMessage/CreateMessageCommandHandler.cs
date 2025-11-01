using ChatApp.Application.Abstractions;
using ChatApp.Domain.Entities;
using ChatApp.Domain.Enum;
using MediatR;

namespace ChatApp.Application.Features.CreateMessage;

public class CreateMessageCommandHandler(IMessageRepository messageRepository)
    : IRequestHandler<CreateMessageCommand, CreateMessageResponse>
{
    public async Task<CreateMessageResponse> Handle(CreateMessageCommand request, CancellationToken cancellationToken)
    {
        //create message in existing conversation
        if (request.ConversationId is null || request.ConversationId == Guid.Empty)
            throw new ArgumentNullException(nameof(request.ConversationId));
        var res = await AddMessageToConversationAsync(request.ConversationId.Value, request, cancellationToken);
        return res;
    }

    private async Task<CreateMessageResponse> AddMessageToConversationAsync(
        Guid conversationId, 
        CreateMessageCommand request, 
        CancellationToken cancellationToken)
    {
        var message = Messages.Create(conversationId, request.SenderId, request.Content);
        await messageRepository.CreateMessageAsync(message, cancellationToken);
        var response = new CreateMessageResponse
        {
            MessageId = message.Id,
            ConversationId = conversationId,
            SenderId = request.SenderId,
            Content = request.Content,
            CreatedAt = message.CreatedAt
        };
        return response;
    }
}