import { useState, FormEvent, KeyboardEvent, useRef, useEffect } from 'react';
import { Send, Smile } from 'lucide-react';
import { Button } from '@workspace/ui/components/Button';
import { Input } from '@workspace/ui/components/Textfield';
import { signalRService } from '../../lib/signalr/hub';

interface ComposerProps {
  conversationId?: string;
  onSend: (text: string) => void;
  isSending?: boolean;
  onFocus?: () => void;
}

export function Composer({ conversationId, onSend, isSending = false, onFocus }: ComposerProps) {
  const [message, setMessage] = useState('');
  const typingTimeoutRef = useRef<number | null>(null);
  const isTypingRef = useRef(false);

  // Clean up typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      // Send typing stopped when component unmounts
      if (isTypingRef.current && conversationId) {
        signalRService.typingStopped(conversationId).catch(console.error);
      }
    };
  }, [conversationId]);

  const handleTypingStarted = async () => {
    if (!conversationId || !signalRService.isConnected()) {
      console.log('⚠️ Cannot send typing started: conversationId or connection missing');
      return;
    }

    // Only send typing started if not already typing
    if (!isTypingRef.current) {
      try {
        console.log('📤 Sending TypingStarted to server:', conversationId);
        await signalRService.typingStarted(conversationId);
        isTypingRef.current = true;
        console.log('✅ TypingStarted sent successfully');
      } catch (error) {
        console.error('❌ Failed to send typing started:', error);
      }
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to automatically stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      console.log('⏱️ Auto-stopping typing (3s timeout)');
      handleTypingStopped();
    }, 3000);
  };

  const handleTypingStopped = async () => {
    if (!conversationId || !signalRService.isConnected()) return;

    if (isTypingRef.current) {
      try {
        console.log('📤 Sending TypingStopped to server:', conversationId);
        await signalRService.typingStopped(conversationId);
        isTypingRef.current = false;
        console.log('✅ TypingStopped sent successfully');
      } catch (error) {
        console.error('❌ Failed to send typing stopped:', error);
      }
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const handleInputFocus = () => {
    // Call parent's onFocus handler (for mark as read)
    onFocus?.();
  };

  const handleInputBlur = () => {
    // Stop typing when input loses focus
    handleTypingStopped();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setMessage(newValue);

    // Trigger typing started when user types
    if (newValue.length > 0) {
      handleTypingStarted();
    } else {
      // If message is empty, stop typing
      handleTypingStopped();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isSending) {
      onSend(message.trim());
      setMessage('');
      // Stop typing when message is sent
      handleTypingStopped();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-4 bg-background">
      <div className="flex items-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          aria-label="Add emoji"
        >
          <Smile className="w-5 h-5" />
        </Button>

        <div className="flex-1">
          <Input
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="Message"
            className="w-full"
            aria-label="Type a message"
          />
        </div>

        <Button
          type="submit"
          size="icon"
          isDisabled={!message.trim() || isSending}
          className="shrink-0"
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </form>
  );
}
