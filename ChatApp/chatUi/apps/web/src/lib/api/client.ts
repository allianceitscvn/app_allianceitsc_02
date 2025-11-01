import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { handleApiError } from '../toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7123';

// Storage keys
const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const EXPIRED_AT_KEY = 'expiredAt';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - attach token to every request
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getToken();
        
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors and token expiration
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized (token expired or invalid)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Try to refresh the token
            const refreshToken = this.getRefreshToken();
            
            if (refreshToken) {
              // You can implement token refresh logic here if your API supports it
              // const response = await this.post('/api/auth/refresh-token', { refreshToken });
              // this.setToken(response.data.accessToken, response.data.refreshToken, response.data.expiredAt);
              // return this.client(originalRequest);
            }
            
            // If no refresh token or refresh fails, clear tokens and redirect to login
            this.clearTokens();
            handleApiError(error, 'Session expired. Please login again.');
            window.location.href = '/login';
          } catch (refreshError) {
            this.clearTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        // Handle other errors with toast notifications
        // Parse error response and show toast
        if (error.response) {
          // Server responded with error status (4xx, 5xx)
          const errorData = error.response.data;
          
          // Check for specific error format: { error: "NotFoundException", message: "User not found" }
          let errorMessage = 'An error occurred';
          
          if (errorData?.message) {
            errorMessage = errorData.message;
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          } else if (errorData?.error) {
            errorMessage = errorData.error;
          } else if (error.message) {
            errorMessage = error.message;
          }

          // Only show toast for non-401 errors (401 is handled above)
          if (error.response.status !== 401) {
            handleApiError(error, errorMessage);
          }
        } else if (error.request) {
          // Request made but no response received
          handleApiError(error, 'Network error. Please check your connection.');
        } else {
          // Something else happened
          handleApiError(error, error.message || 'An unexpected error occurred');
        }

        return Promise.reject(error);
      }
    );
  }

  // Token management methods
  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  public getExpiredAt(): string | null {
    return localStorage.getItem(EXPIRED_AT_KEY);
  }

  public setToken(accessToken: string, refreshToken: string, expiredAt: string): void {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(EXPIRED_AT_KEY, expiredAt);
  }

  public clearTokens(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(EXPIRED_AT_KEY);
  }

  public isTokenExpired(): boolean {
    const expiredAt = this.getExpiredAt();
    if (!expiredAt) return true;
    
    const expirationDate = new Date(expiredAt);
    return expirationDate <= new Date();
  }

  // HTTP Methods
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  // Get raw axios instance if needed for special cases
  public getInstance(): AxiosInstance {
    return this.client;
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();
