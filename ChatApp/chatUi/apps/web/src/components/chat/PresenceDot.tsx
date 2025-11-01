import { cn } from '@workspace/ui/lib/utils';

interface PresenceDotProps {
  status: 'online' | 'offline';
  className?: string;
}

export function PresenceDot({ status, className }: PresenceDotProps) {
  return (
    <span
      className={cn(
        'inline-block w-2.5 h-2.5 rounded-full',
        status === 'online' ? 'bg-green-500' : 'bg-gray-400',
        className
      )}
      aria-label={status === 'online' ? 'Online' : 'Offline'}
      role="status"
    />
  );
}
