import { useState, FormEvent, KeyboardEvent } from 'react';
import { Send, Smile } from 'lucide-react';
import { Button } from '@workspace/ui/components/Button';
import { Input } from '@workspace/ui/components/Textfield';

interface ComposerProps {
  onSend: (text: string) => void;
  isSending?: boolean;
  onFocus?: () => void;
}

export function Composer({ onSend, isSending = false, onFocus }: ComposerProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isSending) {
      onSend(message.trim());
      setMessage('');
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
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
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
