import { useEffect, useState } from 'react';
import { cn } from '@workspace/ui/lib/utils';

interface TypingIndicatorProps {
  typingUsers: Array<{ userId: string; displayName: string }>;
  currentUserId: string;
  className?: string;
}

export function TypingIndicator({ typingUsers, currentUserId, className }: TypingIndicatorProps) {
  // Filter out current user (shouldn't happen but safety check)
  const otherUsersTyping = typingUsers.filter(user => user.userId !== currentUserId);

  if (otherUsersTyping.length === 0) {
    return null;
  }

  const getTypingText = () => {
    const count = otherUsersTyping.length;
    
    if (count === 1) {
      return `${otherUsersTyping[0]?.displayName || 'Someone'} đang soạn tin`;
    } else if (count === 2) {
      return `${otherUsersTyping[0]?.displayName || 'Someone'} and ${otherUsersTyping[1]?.displayName || 'someone'} are typing`;
    } else if (count === 3) {
      return `${otherUsersTyping[0]?.displayName || 'Someone'}, ${otherUsersTyping[1]?.displayName || 'someone'}, and ${otherUsersTyping[2]?.displayName || 'someone'} are typing`;
    } else {
      return `${otherUsersTyping[0]?.displayName || 'Someone'}, ${otherUsersTyping[1]?.displayName || 'someone'}, and ${count - 2} others are typing`;
    }
  };

  return (
    <div className={cn('px-4 py-2 text-sm text-muted-foreground flex items-center gap-2', className)}>
      <span className='text-blue-500'>{getTypingText()}</span>
      <TypingDots />
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex gap-1 items-center">
      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-typing-dot-1" />
      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-typing-dot-2" />
      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-typing-dot-3" />
    </div>
  );
}
