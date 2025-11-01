import { create } from 'zustand';
import { Members, ID } from '../types';
import { membersApi } from '../lib/api/members';
import { signalRService } from '../lib/signalr/hub';
import Toast from '../lib/toast';

interface DirectoryState {
  members: Members[];
  isLoading: boolean;
  error: string | null;
}

interface DirectoryActions {
  loadMembers: () => Promise<void>;
  setMemberPresence: (userId: ID, isOnline: boolean) => void;
  subscribeToPresence: () => () => void;
  updateMembersList: (members: Members[]) => void;
}

export const useDirectoryStore = create<DirectoryState & DirectoryActions>((set, get) => ({
  members: [],
  isLoading: false,
  error: null,

  loadMembers: async () => {
    set({ isLoading: true, error: null });
    try {
      // Fetch online members from API
      const members = await membersApi.getOnlineMembers();
      set({ members, isLoading: false });
      
      console.log(`Loaded ${members.length} members from API`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load members';
      console.error('Failed to load members:', error);
      set({ error: errorMessage, isLoading: false });
      // Error toast is already shown by API interceptor
    }
  },

  updateMembersList: (members: Members[]) => {
    set({ members });
  },

  setMemberPresence: (userId: ID, isOnline: boolean) => {
    set((state) => ({
      members: state.members.map(member =>
        member.id === userId
          ? { ...member, isOnline }
          : member
      )
    }));
  },

  subscribeToPresence: () => {
    // Subscribe to SignalR presence events
    const handleUserOnline = (userId: string) => {
      console.log('User came online:', userId);
      get().setMemberPresence(userId, true);
    };

    const handleUserOffline = (userId: string) => {
      console.log('User went offline:', userId);
      get().setMemberPresence(userId, false);
    };

    const handlePresenceUpdate = (userId: string, isOnline: boolean) => {
      console.log('Presence update:', userId, isOnline);
      get().setMemberPresence(userId, isOnline);
    };

    // Register SignalR event handlers
    signalRService.on('UserOnline', handleUserOnline);
    signalRService.on('UserOffline', handleUserOffline);
    signalRService.on('PresenceUpdate', handlePresenceUpdate);

    // Return cleanup function
    return () => {
      signalRService.off('UserOnline', handleUserOnline);
      signalRService.off('UserOffline', handleUserOffline);
      signalRService.off('PresenceUpdate', handlePresenceUpdate);
    };
  }
}));
