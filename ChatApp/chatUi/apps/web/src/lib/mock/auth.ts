import { User } from "../../types";
import { mockUsers } from "./data";

export const mockAuthService = {
  async login(username: string): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.username === username);
    if (existingUser) {
      return existingUser;
    }
    
    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      username,
      displayName: username.split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      presence: "online",
      role: "Team Member"
    };
    
    mockUsers.push(newUser);
    return newUser;
  },
  
  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
  },
  
  async getCurrentUser(): Promise<User | null> {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  }
};
