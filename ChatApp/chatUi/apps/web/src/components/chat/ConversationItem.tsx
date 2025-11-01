import { useState } from 'react';
import { Conversation, User } from '../../types';
import { Avatar, AvatarImage, AvatarFallback } from '@workspace/ui/components/Avatar';
import { Badge } from '@workspace/ui/components/Badge';
import { Button } from '@workspace/ui/components/Button';
import { MenuTrigger, Menu, MenuPopover, MenuItem } from '@workspace/ui/components/Menu';
import { cn } from '@workspace/ui/lib/utils';
import { formatDistanceToNow } from '../../lib/utils';
import { MoreVertical, Trash2 } from 'lucide-react';

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
  onDelete?: (conversationId: string) => void | Promise<void>;
  otherUser?: User;
}

export function ConversationItem({ 
  conversation, 
  isSelected, 
  onClick,
  onDelete,
  otherUser 
}: ConversationItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const displayName = conversation.title || otherUser?.displayName || 'Unknown';
  const avatar = conversation.avatarUrl || otherUser?.avatarUrl;
  const lastMessageText = conversation.lastMessage?.text || 'No messages yet';
  const timestamp = conversation.lastMessage?.createdAt;

  return (
    <div
      className={cn(
        'w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors relative group',
        isSelected && 'bg-muted'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={onClick}
        className="flex items-center gap-3 flex-1 min-w-0 text-left"
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

      {/* Menu button - visible on hover */}
      <div 
        className={cn(
          'absolute right-2 top-1/2 -translate-y-1/2 transition-opacity',
          isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuTrigger>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
          <MenuPopover placement="bottom end">
            <Menu 
              onAction={(key) => {
                if (key === 'delete' && onDelete) {
                  onDelete(conversation.id);
                }
              }}
            >
              <MenuItem
                id="delete"
                textValue="Xoá"
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                <span>Xoá cuộc trò chuyện</span>
              </MenuItem>
            </Menu>
          </MenuPopover>
        </MenuTrigger>
      </div>
    </div>
  );
}
