// /frontend/src/services/authService.js
import axiosInstance from '@lib/axios';

/**
 * Authentication service for handling user authentication
 */
const authService = {
  /**
   * Check if user is already authenticated
   * @returns {Promise<Object>} User data
   */
  checkAuthStatus: async () => {
    try {
      // Check if token exists
      const token = localStorage.getItem('authToken');
      if (!token) {
        return null;
      }
      
      // Verify token with backend
      const response = await axiosInstance.get('/auth/me');
      return response.data.data;
    } catch (error) {
      localStorage.removeItem('authToken');
      throw error;
    }
  },
  
  /**
   * Login user with credentials
   * @param {Object} credentials - User credentials (email, password)
   * @returns {Promise<Object>} User data
   */
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      // Store token
      localStorage.setItem('authToken', token);
      
      return user;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Logout current user
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      // Call logout endpoint to invalidate token on server
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Remove token regardless of server response
      localStorage.removeItem('authToken');
    }
  },
  
  /**
   * Check if user has admin role
   * @param {Object} user - User object
   * @returns {boolean} True if user is admin
   */
  isAdmin: (user) => {
    return user?.role === 'admin';
  }
};

export default authService;