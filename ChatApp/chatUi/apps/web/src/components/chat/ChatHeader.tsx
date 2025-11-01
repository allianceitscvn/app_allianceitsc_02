import { Search, MoreVertical, Users } from 'lucide-react';
import { Members } from '../../types';
import { Avatar, AvatarImage,AvatarFallback } from '@workspace/ui/components/Avatar';
import { Button } from '@workspace/ui/components/Button';
import { PresenceDot } from './PresenceDot';
import { formatDistanceToNow } from '../../lib/utils';

interface ChatHeaderProps {
  user?: Members;
  title?: string;
  avatarUrl?: string;
  onMembersClick?: () => void;
}

export function ChatHeader({ user, title, avatarUrl, onMembersClick }: ChatHeaderProps) {
  const displayName = title || user?.displayName || 'Chat';
  const avatar = avatarUrl;
  
  let presenceText = '';
  if (user) {
    if (user.isOnline) {
      presenceText = 'online';
    } else {
      presenceText = 'offline';
    }
  }

  return (
    <div className="flex items-center gap-3 p-4 border-b bg-background">
      <Avatar className="h-10 w-10">
        <AvatarFallback>
          {displayName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <h2 className="font-semibold truncate">{displayName}</h2>
        {user && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <PresenceDot status={user.isOnline ? 'online' : 'offline'} />
            <span>{presenceText}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="Search in chat">
          <Search className="w-5 h-5" />
        </Button>
        {onMembersClick && (
          <Button 
            variant="ghost" 
            size="icon" 
            aria-label="Show members"
            onClick={onMembersClick}
            className="lg:hidden"
          >
            <Users className="w-5 h-5" />
          </Button>
        )}
        <Button variant="ghost" size="icon" aria-label="More options">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
