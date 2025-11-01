import { PresenceEvent, ID } from "../../types";
import { mockUsers } from "./data";

export type PresenceCallback = (event: PresenceEvent) => void;

let presenceSubscribers: PresenceCallback[] = [];
let presenceInterval: ReturnType<typeof setInterval> | null = null;

export const mockPresenceService = {
  subscribe(callback: PresenceCallback): () => void {
    presenceSubscribers.push(callback);
    
    // Start simulating presence changes if not already started
    if (!presenceInterval) {
      presenceInterval = setInterval(() => {
        // Randomly toggle presence for a user
        const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        if (randomUser && randomUser.id !== 'current-user') {
          const newPresence = randomUser.presence === 'online' ? 'offline' : 'online';
          randomUser.presence = newPresence;
          
          if (newPresence === 'offline') {
            randomUser.lastSeen = new Date().toISOString();
          }
          
          const event: PresenceEvent = {
            userId: randomUser.id,
            presence: newPresence,
            timestamp: new Date().toISOString()
          };
          
          // Notify all subscribers
          presenceSubscribers.forEach(sub => sub(event));
        }
      }, 15000); // Every 15 seconds
    }
    
    // Return unsubscribe function
    return () => {
      presenceSubscribers = presenceSubscribers.filter(sub => sub !== callback);
      
      // Stop interval if no more subscribers
      if (presenceSubscribers.length === 0 && presenceInterval) {
        clearInterval(presenceInterval);
        presenceInterval = null;
      }
    };
  },
  
  async setPresence(userId: ID, presence: 'online' | 'offline'): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.presence = presence;
      if (presence === 'offline') {
        user.lastSeen = new Date().toISOString();
      }
    }
  }
};
