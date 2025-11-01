import { Conversation, Message, ID } from "../../types";
import { mockConversations, mockMessages, mockUsers } from "./data";

let conversationsCache = [...mockConversations];
let messagesCache = [...mockMessages];

export const mockChatService = {
  async listConversations(userId: ID): Promise<Conversation[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return conversationsCache.filter(conv => conv.memberIds.includes(userId));
  },
  
  async listMessages(conversationId: ID): Promise<Message[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return messagesCache.filter(msg => msg.conversationId === conversationId);
  },
  
  async sendMessage(conversationId: ID, text: string, senderId: ID): Promise<Message> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId,
      text,
      createdAt: new Date().toISOString(),
      status: "sent"
    };
    
    messagesCache.push(newMessage);
    
    // Update conversation's last message
    const conv = conversationsCache.find(c => c.id === conversationId);
    if (conv) {
      conv.lastMessage = newMessage;
    }
    
    // Simulate message delivery after a delay
    setTimeout(() => {
      newMessage.status = "delivered";
      setTimeout(() => {
        newMessage.status = "read";
      }, 1000);
    }, 500);
    
    return newMessage;
  },
  
  async addReaction(conversationId: ID, messageId: ID, emoji: string, userId: ID): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const message = messagesCache.find(m => m.id === messageId && m.conversationId === conversationId);
    if (message) {
      if (!message.reactions) {
        message.reactions = [];
      }
      
      const existingReaction = message.reactions.find(r => r.emoji === emoji);
      if (existingReaction) {
        if (!existingReaction.userIds.includes(userId)) {
          existingReaction.userIds.push(userId);
        }
      } else {
        message.reactions.push({ emoji, userIds: [userId] });
      }
    }
  },
  
  async markAsRead(conversationId: ID): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const conv = conversationsCache.find(c => c.id === conversationId);
    if (conv) {
      conv.unreadCount = 0;
    }
  },
  
  async ensureDMWith(userId: ID, currentUserId: ID): Promise<Conversation> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check if conversation already exists
    const existing = conversationsCache.find(
      conv => !conv.isGroup && 
      conv.memberIds.includes(userId) && 
      conv.memberIds.includes(currentUserId)
    );
    
    if (existing) {
      return existing;
    }
    
    // Create new conversation
    const user = mockUsers.find(u => u.id === userId);
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      memberIds: [currentUserId, userId],
      unreadCount: 0,
      isGroup: false,
      avatarUrl: user?.avatarUrl
    };
    
    conversationsCache.push(newConv);
    return newConv;
  },
  
  // Helper to get conversation details
  async getConversation(conversationId: ID): Promise<Conversation | undefined> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return conversationsCache.find(c => c.id === conversationId);
  }
};
