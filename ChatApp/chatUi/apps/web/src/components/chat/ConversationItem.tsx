import { Conversation, User } from '../../types';
import { Avatar, AvatarImage, AvatarFallback } from '@workspace/ui/components/Avatar';
import { Badge } from '@workspace/ui/components/Badge';
import { cn } from '@workspace/ui/lib/utils';
import { formatDistanceToNow } from '../../lib/utils';

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
  otherUser?: User;
}

export function ConversationItem({ 
  conversation, 
  isSelected, 
  onClick,
  otherUser 
}: ConversationItemProps) {
  const displayName = conversation.title || otherUser?.displayName || 'Unknown';
  const avatar = conversation.avatarUrl || otherUser?.avatarUrl;
  const lastMessageText = conversation.lastMessage?.text || 'No messages yet';
  const timestamp = conversation.lastMessage?.createdAt;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left',
        isSelected && 'bg-muted'
      )}
      aria-label={`Conversation with ${displayName}`}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatar} alt={displayName} />
        <AvatarFallback>
          {displayName.charAt(0).toUpperCase()}
        </AvatarFallback>
        </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold truncate">{displayName}</h3>
          {timestamp && (
            <span className="text-xs text-muted-foreground ml-2">
              {formatDistanceToNow(timestamp)}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {lastMessageText}
        </p>
      </div>

      {conversation.unreadCount ? (
        <Badge variant="default" className="ml-2 shrink-0">
          {conversation.unreadCount}
        </Badge>
      ) : null}
    </button>
  );
}
