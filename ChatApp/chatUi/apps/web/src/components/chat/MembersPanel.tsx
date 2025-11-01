import { Members } from '../../types';
import { Avatar, AvatarImage, AvatarFallback} from '@workspace/ui/components/Avatar';
import { Button } from '@workspace/ui/components/Button';
import { ScrollArea } from '@workspace/ui/components/ScrollArea';
import { Skeleton } from '@workspace/ui/components/Skeleton';
import { PresenceDot } from './PresenceDot';
import { MessageSquare } from 'lucide-react';

interface MembersPanelProps {
  members: Members[];
  onStartChat: (userId: string) => void;
  isLoading?: boolean;
}

export function MembersPanel({ members, onStartChat, isLoading = false }: MembersPanelProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header - Hidden on mobile (shown in AppShell), visible on desktop */}
      <div className="p-4 border-b hidden lg:block">
        <h2 className="font-semibold">All Members</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {members.length} team {members.length === 1 ? 'member' : 'members'}
        </p>
      </div>

      {/* Members List */}
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="p-3 space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div className="relative">
                  <Avatar
                    className="h-10 w-10"
                  >
                    <AvatarFallback>
                      {member.displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0">
                    <PresenceDot status={member.isOnline ? 'online' : 'offline'} />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{member.displayName}</h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {member.email}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  onClick={() => onStartChat(member.id)}
                  aria-label={`Start chat with ${member.displayName}`}
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
