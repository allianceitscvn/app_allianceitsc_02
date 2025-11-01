import * as signalR from '@microsoft/signalr';
import { apiClient } from '../api/client';
import Toast from '../toast';

const HUB_URL = `${import.meta.env.VITE_API_BASE_URL}/hubs/chat`;

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private isConnecting = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  /**
   * Get the current hub connection
   */
  getConnection(): signalR.HubConnection | null {
    return this.connection;
  }

  /**
   * Check if connected to the hub
   */
  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  /**
   * Start connection to SignalR hub
   */
  async connect(): Promise<void> {
    if (this.isConnected()) {
      console.log('SignalR: Already connected');
      return;
    }

    if (this.isConnecting) {
      console.log('SignalR: Connection in progress');
      return;
    }

    this.isConnecting = true;

    try {
      // Get the access token
      const token = apiClient.getToken();
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Create new connection
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(HUB_URL, {
          accessTokenFactory: () => token,
          transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.ServerSentEvents,
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            // Exponential backoff: 0s, 2s, 10s, 30s, then 60s
            if (retryContext.elapsedMilliseconds < 60000) {
              return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
            }
            return 60000;
          },
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();

      // Setup event handlers
      this.setupEventHandlers();

      // Start the connection
      await this.connection.start();
      
      console.log('SignalR: Connected successfully');
      
      this.reconnectAttempts = 0;
    } catch (error) {
      console.error('SignalR: Connection failed', error);
      Toast.error('Failed to connect to chat server');
      throw error;
    } finally {
      this.isConnecting = false;
    }
  }

  /**
   * Disconnect from SignalR hub
   */
  async disconnect(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log('SignalR: Disconnected');
      } catch (error) {
        console.error('SignalR: Disconnect error', error);
      } finally {
        this.connection = null;
      }
    }
  }

  /**
   * Setup connection event handlers
   */
  private setupEventHandlers(): void {
    if (!this.connection) return;

    // Connection closed
    this.connection.onclose((error) => {
      console.log('SignalR: Connection closed', error);
      if (error) {
        Toast.error('Chat connection lost');
      }
    });

    // Reconnecting
    this.connection.onreconnecting((error) => {
      console.log('SignalR: Reconnecting...', error);
      Toast.info('Reconnecting to chat server...');
      this.reconnectAttempts++;
    });

    // Reconnected
    this.connection.onreconnected((connectionId) => {
      console.log('SignalR: Reconnected', connectionId);
      Toast.success('Reconnected to chat server');
      this.reconnectAttempts = 0;
    });
  }

  /**
   * Send a message through the hub
   * @param method - Hub method name
   * @param args - Arguments to pass to the method
   */
  async invoke<T = any>(method: string, ...args: any[]): Promise<T> {
    if (!this.connection || !this.isConnected()) {
      throw new Error('SignalR connection not established');
    }

    try {
      return await this.connection.invoke<T>(method, ...args);
    } catch (error) {
      console.error(`SignalR: Failed to invoke ${method}`, error);
      throw error;
    }
  }

  /**
   * Register a handler for hub events
   * @param eventName - Event name to listen to
   * @param handler - Callback function
   */
  on(eventName: string, handler: (...args: any[]) => void): void {
    if (!this.connection) {
      console.warn('SignalR: Cannot register handler, connection not initialized');
      return;
    }

    this.connection.on(eventName, handler);
  }

  /**
   * Unregister a handler for hub events
   * @param eventName - Event name to stop listening to
   */
  off(eventName: string, handler?: (...args: any[]) => void): void {
    if (!this.connection) return;

    if (handler) {
      this.connection.off(eventName, handler);
    } else {
      this.connection.off(eventName);
    }
  }

  /**
   * Get list of online users from the server
   */
  async getUserOnline(): Promise<string[]> {
    return this.invoke<string[]>('GetUserOnline');
  }

  /**
   * Join a conversation room
   * Matches server method: JoinConversation(Guid conversationId)
   */
  async joinConversation(conversationId: string): Promise<void> {
    return this.invoke('JoinConversation', conversationId);
  }

  /**
   * Leave a conversation room
   * Matches server method: LeaveConversation(Guid conversationId)
   */
  async leaveConversation(conversationId: string): Promise<void> {
    return this.invoke('LeaveConversation', conversationId);
  }

  /**
   * Send a message to a conversation
   * Matches server method: SendMessage(Guid conversationId, string content)
   */
  async sendMessage(conversationId: string, content: string): Promise<void> {
    return this.invoke('SendMessage', conversationId, content);
  }

  /**
   * Notify typing started in a conversation
   * Matches server method: TypingStarted(Guid conversationId)
   */
  async typingStarted(conversationId: string): Promise<void> {
    return this.invoke('TypingStarted', conversationId);
  }

  /**
   * Notify typing stopped in a conversation
   * Matches server method: TypingStopped(Guid conversationId)
   */
  async typingStopped(conversationId: string): Promise<void> {
    return this.invoke('TypingStopped', conversationId);
  }

  /**
   * Mark messages as read in a conversation
   * Matches server method: MarkRead(Guid conversationId, Guid lastReadMessageId)
   */
  async markRead(conversationId: string, lastReadMessageId: string): Promise<void> {
    return this.invoke('MarkRead', conversationId, lastReadMessageId);
  }
}

// Export singleton instance
export const signalRService = new SignalRService();

// Export for type checking
export type { signalR };
