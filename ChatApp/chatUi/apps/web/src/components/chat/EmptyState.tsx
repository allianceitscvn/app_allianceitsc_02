import { MessageSquare } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="bg-muted rounded-full p-6 mb-4">
        <MessageSquare className="w-16 h-16 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
      <p className="text-muted-foreground max-w-sm">
        Choose a conversation from the list or start a new chat with a team member
      </p>
    </div>
  );
}
