import api from '../lib/axios';
import { formatApiError } from '../utils/api';

/**
 * User interface
 */
export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

/**
 * Authentication response interface
 */
export interface IAuthResponse {
  token: string;
  user: IUser;
}

/**
 * Register data interface
 */
export interface IRegisterData {
  name: string;
  email: string;
  password: string;
}

/**
 * Login data interface
 */
export interface ILoginData {
  email: string;
  password: string;
}

/**
 * Auth service
 * Handles API calls related to authentication
 */
export const authService = {
  /**
   * Register a new user
   */
  async register(data: IRegisterData): Promise<IAuthResponse> {
    try {
      const response = await api.post('/auth/register', data);
      return response.data.data;
    } catch (error) {
      throw new Error(formatApiError(error));
    }
  },

  /**
   * Login user
   */
  async login(data: ILoginData): Promise<IAuthResponse> {
    try {
      const response = await api.post('/auth/login', data);
      return response.data.data;
    } catch (error) {
      throw new Error(formatApiError(error));
    }
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<IUser> {
    try {
      const response = await api.get('/auth/me');
      return response.data.data.user;
    } catch (error) {
      throw new Error(formatApiError(error));
    }
  },

  /**
   * Store authentication data in local storage
   */
  setAuth(data: IAuthResponse): void {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  },

  /**
   * Clear authentication data from local storage
   */
  clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  /**
   * Get stored user data
   */
  getUser(): IUser | null {
    const userData = localStorage.getItem('user');
    if (!userData) return null;
    
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  },

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }
};