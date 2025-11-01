import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { authApi, AuthTokenResponse } from '../lib/api/auth';
import { signalRService } from '../lib/signalr/hub';
import { useDirectoryStore } from './useDirectoryStore';
import { useChatStore } from './useChatStore';
import Toast from '../lib/toast';

interface AuthState {
  currentUser: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiredAt: string | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (username: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  setTokens: (tokens: AuthTokenResponse) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      currentUser: null,
      accessToken: null,
      refreshToken: null,
      expiredAt: null,
      isLoading: false,
      error: null,

      setTokens: (tokens: AuthTokenResponse) => {
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiredAt: tokens.expiredAt,
        });
      },

      login: async (username: string) => {
        set({ isLoading: true, error: null });
        try {
          // Step 1: Call the real API to generate token
          const tokens = await authApi.generateToken(username);
          
          // Create a user object from the username
          const user: User = {
            id: tokens.user.id, // Temporary ID, replace with actual user ID from API
            username,
            displayName: tokens.user.displayName,
            presence: 'online',
          };
          
          set({ 
            currentUser: user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiredAt: tokens.expiredAt,
            isLoading: false 
          });
          
          // Step 2: Connect to SignalR hub for real-time communication
          try {
            await signalRService.connect();
            console.log('SignalR connected successfully');
          } catch (signalRError) {
            console.error('Failed to connect to SignalR:', signalRError);
            // Don't block login if SignalR fails
            Toast.warning('Connected but real-time features may be limited');
          }
          
          // Step 3: Load online members list from API
          try {
            await useDirectoryStore.getState().loadMembers();
            console.log('Members loaded successfully');
          } catch (membersError) {
            console.error('Failed to load members:', membersError);
            // Don't block login if members loading fails
          }
          
          // Step 4: Subscribe to presence updates via SignalR
          try {
            useDirectoryStore.getState().subscribeToPresence();
            console.log('Subscribed to presence updates');
          } catch (presenceError) {
            console.error('Failed to subscribe to presence:', presenceError);
          }
          
          // Step 5: Subscribe to message events via SignalR
          try {
            useChatStore.getState().subscribeToMessages();
            console.log('Subscribed to message events');
          } catch (messageError) {
            console.error('Failed to subscribe to messages:', messageError);
          }
          
          // Step 6: Load user's conversations from API
          try {
            await useChatStore.getState().loadConversations(user.id);
            console.log('Conversations loaded successfully');
          } catch (conversationsError) {
            console.error('Failed to load conversations:', conversationsError);
            // Don't block login if conversations loading fails
          }
          
          // Show success toast
          Toast.success(`Welcome back, ${username}!`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({ 
            error: errorMessage, 
            isLoading: false 
          });
          // Error toast is already handled by API client interceptor
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          // Disconnect from SignalR before logging out
          await signalRService.disconnect();
          console.log('SignalR disconnected');
          
          await authApi.logout();
          set({ 
            currentUser: null,
            accessToken: null,
            refreshToken: null,
            expiredAt: null,
            isLoading: false 
          });
          
          // Clear members list
          useDirectoryStore.getState().updateMembersList([]);
          
          // Show success toast
          Toast.info('You have been logged out successfully');
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Logout failed', 
            isLoading: false 
          });
          // Error toast is already handled by API client interceptor
        }
      },

      initialize: async () => {
        // Check if user is authenticated based on stored tokens
        if (authApi.isAuthenticated()) {
          const token = authApi.getAccessToken();
          if (token) {
            return;
          }
        }
        
        // Clear everything if not authenticated
        set({ 
          currentUser: null,
          accessToken: null,
          refreshToken: null,
          expiredAt: null,
        });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state: AuthState & AuthActions) => ({ 
        currentUser: state.currentUser,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        expiredAt: state.expiredAt,
      }),
    }
  )
);
