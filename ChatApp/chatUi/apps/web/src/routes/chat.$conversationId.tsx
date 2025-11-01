import { createFileRoute, redirect } from '@tanstack/react-router';
import { AppShell } from '../components/chat/AppShell';

export const Route = createFileRoute('/chat/$conversationId')({
  beforeLoad: () => {
    // Check if user is authenticated
    const stored = localStorage.getItem('auth-storage');
    if (stored) {
      const authData = JSON.parse(stored);
      if (!authData.state?.currentUser) {
        throw redirect({ to: '/login' });
      }
    } else {
      throw redirect({ to: '/login' });
    }
  },
  component: ChatPage,
});

function ChatPage() {
  return <AppShell />;
}
