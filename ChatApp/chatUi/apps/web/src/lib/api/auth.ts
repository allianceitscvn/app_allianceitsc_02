import { apiClient } from './client';

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiredAt: string;
  user: UserLogin;

}
export interface UserLogin {
  id : string;
  username:  string;
  displayName: string;
}

export interface GenerateTokenRequest {
  username: string;
}

export const authApi = {
  /**
   * Generate authentication token
   * @param username - The username to authenticate
   * @returns Promise with access token, refresh token, and expiration time
   */
  async generateToken(username: string): Promise<AuthTokenResponse> {
    const response = await apiClient.post<AuthTokenResponse>(
      '/api/auth/generate-token',
      { username }
    );
    
    // Automatically store the tokens
    apiClient.setToken(
      response.accessToken,
      response.refreshToken,
      response.expiredAt
    );
    
    return response;
  },

  /**
   * Logout and clear tokens
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if your API has one
      // await apiClient.post('/api/auth/logout');
    } finally {
      // Always clear tokens locally
      apiClient.clearTokens();
    }
  },

  /**
   * Refresh the access token using refresh token
   */
  async refreshToken(): Promise<AuthTokenResponse> {
    const refreshToken = apiClient.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<AuthTokenResponse>(
      '/api/auth/refresh-token',
      { refreshToken }
    );
    
    // Update stored tokens
    apiClient.setToken(
      response.accessToken,
      response.refreshToken,
      response.expiredAt
    );
    
    return response;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = apiClient.getToken();
    if (!token) return false;
    
    return !apiClient.isTokenExpired();
  },

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return apiClient.getToken();
  },
};
