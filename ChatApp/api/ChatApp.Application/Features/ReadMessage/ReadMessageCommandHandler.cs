using ChatApp.Application.Abstractions;
using ChatApp.Application.Exceptions;
using ChatApp.Domain.Entities;
using MediatR;

namespace ChatApp.Application.Features.ReadMessage;

public class ReadMessageCommandHandler(
    IConversationRepository conversationRepository,
    IMessageRepository messageRepository) : IRequestHandler<ReadMessageCommand, bool>
{
    public async Task<bool> Handle(ReadMessageCommand request, CancellationToken cancellationToken)
    {
        //check user is member of conversation
        var isMember =
            await conversationRepository.IsMemberInConversationAsync(request.ConversationId, request.UserId,
                cancellationToken);
        if (!isMember)
            throw new ForbiddenException("User is not a member of the conversation.");
        
        //check exist message
        var existMessage = await messageRepository.GetMessageByIdAsync(request.LastReadMessageId, cancellationToken);
        if (existMessage is null || existMessage.ConversationId != request.ConversationId)
            throw new NotFoundException("Message not found in conversation.");

        //update read state of conversation for user
        var existReadMessageState =
            await messageRepository.GetReadMessageStateAsync(request.ConversationId, request.UserId, cancellationToken);
        if (existReadMessageState is null)
        {
            var newReadState = ConversationReadState.Create(
                request.ConversationId,
                request.UserId,
                request.LastReadMessageId);
            await messageRepository.CreateReadMessageStateAsync(newReadState, cancellationToken);
        }
        else
        {
            existReadMessageState.LastReadMessageId = request.LastReadMessageId;
            existReadMessageState.LastReadAt =DateTimeOffset.UtcNow;
            await messageRepository.UpdateReadMessageState(existReadMessageState, cancellationToken);
        }
        
        
        return true;
    }
}