import { useEffect, useRef, useState } from 'react';
import { Check, CheckCheck, Loader2 } from 'lucide-react';
import { Message, Members } from '../../types';
import { Avatar, AvatarImage, AvatarFallback } from '@workspace/ui/components/Avatar';
import { ScrollArea } from '@workspace/ui/components/ScrollArea';
import { Button } from '@workspace/ui/components/Button';
import { cn } from '@workspace/ui/lib/utils';
import { formatTime, formatDate } from '../../lib/utils';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  users: Members[];
  onReaction?: (messageId: string, emoji: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export function MessageList({ 
  messages, 
  currentUserId, 
  users, 
  onReaction,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const previousScrollHeight = useRef<number>(0);

  useEffect(() => {
    // Scroll to bottom only on first load
    if (scrollRef.current && isFirstLoad && messages.length > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      setIsFirstLoad(false);
    }
  }, [messages, isFirstLoad]);

  useEffect(() => {
    // Maintain scroll position when loading older messages
    if (scrollRef.current && !isFirstLoad && previousScrollHeight.current > 0) {
      const newScrollHeight = scrollRef.current.scrollHeight;
      const heightDifference = newScrollHeight - previousScrollHeight.current;
      scrollRef.current.scrollTop = heightDifference;
    }
  }, [messages, isFirstLoad]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    
    // Load more when scrolled to top
    if (target.scrollTop === 0 && hasMore && !isLoadingMore && onLoadMore) {
      previousScrollHeight.current = target.scrollHeight;
      onLoadMore();
    }
  };

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = [];
  messages.forEach((msg) => {
    const date = formatDate(msg.createdAt);
    const lastGroup = groupedMessages[groupedMessages.length - 1];
    
    if (lastGroup && lastGroup.date === date) {
      lastGroup.messages.push(msg);
    } else {
      groupedMessages.push({ date, messages: [msg] });
    }
  });

  const getUser = (userId: string) => users.find(u => u.id === userId);

  return (
    <div className="flex-1 overflow-hidden relative">
      <div 
        className="h-full overflow-y-auto px-4 py-6 chat-background"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {/* Loading indicator at top */}
        {isLoadingMore && (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        )}

        <div className="max-w-4xl mx-auto space-y-4" role="log" aria-live="polite" aria-label="Chat messages">
        {groupedMessages.map((group, groupIndex) => (
          <div key={groupIndex}>
            {/* Date Badge */}
            <div className="flex justify-center my-4">
              <div className="bg-muted px-3 py-1 rounded-full text-xs font-medium text-muted-foreground">
                {group.date}
              </div>
            </div>

            {/* Messages */}
            {group.messages.map((message) => {
              const isOwn = message.senderId === currentUserId;
              const sender = getUser(message.senderId);
              const isSystem = message.isSystem;

              if (isSystem) {
                return (
                  <div key={message.id} className="flex justify-center my-2">
                    <div className="bg-muted/50 px-3 py-1.5 rounded-lg text-xs text-muted-foreground">
                      {message.text}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-2 mb-3',
                    isOwn ? 'justify-end' : 'justify-start'
                  )}
                >
                  {!isOwn && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {sender?.displayName?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className={cn('flex flex-col', isOwn ? 'items-end' : 'items-start')}>
                    {/* Message Bubble */}
                    <div
                      className={cn(
                        'rounded-2xl px-4 py-2 max-w-md break-words',
                        isOwn
                          ? 'bg-primary text-white rounded-tr-sm'
                          : 'bg-muted text-foreground rounded-tl-sm'
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    </div>

                    {/* Message metadata */}
                    <div className={cn(
                      'flex items-center gap-2 mt-1 text-xs text-muted-foreground',
                      isOwn && 'flex-row-reverse'
                    )}>
                      <span>{formatTime(message.createdAt)}</span>
                      
                      {isOwn && message.status && (
                        <span className="flex items-center">
                          {message.status === 'sent' && <Check className="w-3 h-3" />}
                          {message.status === 'delivered' && <CheckCheck className="w-3 h-3" />}
                          {message.status === 'read' && (
                            <CheckCheck className="w-3 h-3 text-blue-500" />
                          )}
                        </span>
                      )}

                      {/* Reactions */}
                      {message.reactions && message.reactions.length > 0 && (
                        <div className="flex gap-1">
                          {message.reactions.map((reaction, idx) => (
                            <Button
                              key={idx}
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => onReaction?.(message.id, reaction.emoji)}
                            >
                              <span>{reaction.emoji}</span>
                              <span className="ml-1 text-[10px]">
                                {reaction.userIds.length}
                              </span>
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}
