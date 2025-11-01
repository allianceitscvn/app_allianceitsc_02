export type ID = string;

export interface Members {
  id: ID;
  fullName: string;
  username: string;
  email: string;
  isOnline: boolean;
  displayName: string;
  applicationCode: string;
  applicationUserCode: string;
}

export interface User {
  id: ID;
  username: string;
  displayName: string;
  avatarUrl?: string;
  presence: "online" | "offline";
  lastSeen?: string; // ISO
  role?: string;
}

export interface Message {
  id: ID;
  conversationId: ID;
  senderId: ID;
  text: string;
  createdAt: string; // ISO
  reactions?: { emoji: string; userIds: ID[] }[];
  status?: "sent" | "delivered" | "read";
  isSystem?: boolean;
  senderName?: string; // Display name of sender (optional, for UI display)
}

export type ConversationType = 'DIRECT' | 'GROUP' | 'EXTERNAL_GROUP';

export interface Conversation {
  id: ID;
  title?: string;
  memberIds: ID[];     // includes current user
  lastMessage?: Message;
  unreadCount?: number;
  isGroup?: boolean;
  avatarUrl?: string;
  type?: ConversationType;  // Conversation type from backend
}

export interface PresenceEvent {
  userId: ID;
  presence: "online" | "offline";
  timestamp: string;
}
