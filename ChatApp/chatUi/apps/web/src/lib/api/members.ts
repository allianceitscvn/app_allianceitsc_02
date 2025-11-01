import { apiClient } from './client';
import { Members } from '../../types';

export const membersApi = {
  /**
   * Get list of online members
   * @returns Promise with array of members
   */
  async getOnlineMembers(): Promise<Members[]> {
    return apiClient.get<Members[]>('/api/users/online');
  },

  /**
   * Get all members (online and offline)
   * @returns Promise with array of members
   */
  async getAllMembers(): Promise<Members[]> {
    return apiClient.get<Members[]>('/api/users');
  },

  /**
   * Get a specific member by ID
   * @param userId - The user ID to fetch
   * @returns Promise with member details
   */
  async getMemberById(userId: string): Promise<Members> {
    return apiClient.get<Members>(`/api/users/${userId}`);
  },

  /**
   * Search members by name or email
   * @param query - Search query string
   * @returns Promise with array of matching members
   */
  async searchMembers(query: string): Promise<Members[]> {
    return apiClient.get<Members[]>('/api/users/search', {
      params: { q: query },
    });
  },

  /**
   * Update member presence status
   * @param userId - The user ID
   * @param isOnline - Online status
   */
  async updateMemberPresence(userId: string, isOnline: boolean): Promise<void> {
    return apiClient.put(`/api/users/${userId}/presence`, { isOnline });
  },
};
