import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router';
import { useState, FormEvent } from 'react';
import { TextField } from 'react-aria-components';
import { Button } from '@workspace/ui/components/Button';
import { Input } from '@workspace/ui/components/Textfield';
import { Label } from '@workspace/ui/components/Field';
import { Card } from '@workspace/ui/components/Card';
import { useAuthStore } from '../stores/useAuthStore';

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    // Redirect to chat if already authenticated
    const stored = localStorage.getItem('auth-storage');
    if (stored) {
      const authData = JSON.parse(stored);
      if (authData.state?.currentUser && authData.state?.accessToken) {
        throw redirect({ to: '/chat' });
      }
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const [username, setUsername] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) return;

    try {
      await login(username.trim());
      navigate({ to: '/chat' });
    } catch (error) {
      // Error is already handled by toast in API client and auth store
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to ChatApp</h1>
          <p className="text-muted-foreground">Enter your username to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <TextField
            isRequired
            autoFocus
            className="w-full space-y-2"
          >
            <Label>Username</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </TextField>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isDisabled={!username.trim() || isLoading}
          >
            {isLoading ? 'Connecting...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-xs text-center text-muted-foreground mt-6">
          Enter your username to authenticate with the server.
        </p>
      </Card>
    </div>
  );
}
