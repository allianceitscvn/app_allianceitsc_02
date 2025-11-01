import { User, Message, Conversation } from "../../types";

// Mock users - company members
export const mockUsers: User[] = [
  {
    id: "user-1",
    username: "david.moore",
    displayName: "David Moore",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    presence: "online",
    role: "Product Manager"
  },
  {
    id: "user-2",
    username: "jessica.drew",
    displayName: "Jessica Drew",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    presence: "online",
    role: "Senior Developer"
  },
  {
    id: "user-3",
    username: "greg.james",
    displayName: "Greg James",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Greg",
    presence: "online",
    role: "Engineering Lead"
  },
  {
    id: "user-4",
    username: "emily.dorson",
    displayName: "Emily Dorson",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    presence: "offline",
    lastSeen: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    role: "UX Designer"
  },
  {
    id: "user-5",
    username: "chatgram",
    displayName: "Chatgram",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Chatgram",
    presence: "online",
    role: "System"
  },
  {
    id: "user-6",
    username: "sarah.connor",
    displayName: "Sarah Connor",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    presence: "offline",
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    role: "Marketing Director"
  },
  {
    id: "user-7",
    username: "mike.ross",
    displayName: "Mike Ross",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    presence: "online",
    role: "DevOps Engineer"
  },
  {
    id: "user-8",
    username: "anna.lee",
    displayName: "Anna Lee",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna",
    presence: "offline",
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    role: "QA Lead"
  }
];

// Mock messages
export const mockMessages: Message[] = [
  {
    id: "msg-1",
    conversationId: "conv-1",
    senderId: "user-1",
    text: "OMG 😱 do you remember what you did last night at the work night out?",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    status: "read",
    reactions: [{ emoji: "❤️", userIds: ["current-user"] }]
  },
  {
    id: "msg-2",
    conversationId: "conv-1",
    senderId: "current-user",
    text: "no haha",
    createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    status: "delivered"
  },
  {
    id: "msg-3",
    conversationId: "conv-1",
    senderId: "current-user",
    text: "i don't remember anything 😅",
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    status: "delivered"
  },
  {
    id: "msg-4",
    conversationId: "conv-2",
    senderId: "user-2",
    text: "Ok, see you later",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    status: "read"
  },
  {
    id: "msg-5",
    conversationId: "conv-3",
    senderId: "user-3",
    text: "I got a job at SpaceX 🎉 🚀",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    status: "read"
  },
  {
    id: "msg-6",
    conversationId: "conv-4",
    senderId: "user-4",
    text: "Table for four, 5PM. Be there.",
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    status: "read"
  },
  {
    id: "msg-7",
    conversationId: "conv-5",
    senderId: "user-5",
    text: "Chatgram Web was updated.",
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    status: "read",
    isSystem: true
  },
  {
    id: "msg-8",
    conversationId: "conv-6",
    senderId: "current-user",
    text: "Lewis: All done mate 😊",
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    status: "read"
  },
  {
    id: "msg-9",
    conversationId: "conv-7",
    senderId: "user-6",
    text: "Channel created",
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    status: "read",
    isSystem: true
  },
  {
    id: "msg-10",
    conversationId: "conv-8",
    senderId: "user-7",
    text: "Tell mom i will be home for tea 💜",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: "read"
  }
];

// Mock conversations
export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    memberIds: ["current-user", "user-1"],
    lastMessage: mockMessages[2],
    unreadCount: 0,
    isGroup: false
  },
  {
    id: "conv-2",
    memberIds: ["current-user", "user-2"],
    lastMessage: mockMessages[3],
    unreadCount: 2,
    isGroup: false
  },
  {
    id: "conv-3",
    memberIds: ["current-user", "user-3"],
    lastMessage: mockMessages[4],
    unreadCount: 0,
    isGroup: false
  },
  {
    id: "conv-4",
    memberIds: ["current-user", "user-4"],
    lastMessage: mockMessages[5],
    unreadCount: 0,
    isGroup: false
  },
  {
    id: "conv-5",
    memberIds: ["current-user", "user-5"],
    lastMessage: mockMessages[6],
    unreadCount: 1,
    isGroup: false
  },
  {
    id: "conv-6",
    title: "Office Chat",
    memberIds: ["current-user", "user-2", "user-3", "user-4"],
    lastMessage: mockMessages[7],
    unreadCount: 0,
    isGroup: true,
    avatarUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=Office"
  },
  {
    id: "conv-7",
    title: "Announcements",
    memberIds: ["current-user", "user-1", "user-2", "user-3", "user-4", "user-5"],
    lastMessage: mockMessages[8],
    unreadCount: 0,
    isGroup: true,
    avatarUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=Announcements"
  },
  {
    id: "conv-8",
    title: "Little Sister",
    memberIds: ["current-user", "user-7"],
    lastMessage: mockMessages[9],
    unreadCount: 0,
    isGroup: false
  }
];
