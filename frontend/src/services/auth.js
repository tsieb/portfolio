// File: /frontend/src/services/auth.js
// Authentication service for handling login, logout, and current user

import api from './api';

/**
 * Login user and retrieve token
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Auth response with user data and token
 */
const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user and clear token
 * @returns {Promise<Object>} Logout response
 */
const logout = async () => {
  try {
    const response = await api.get('/auth/logout');
    localStorage.removeItem('token');
    return response.data;
  } catch (error) {
    localStorage.removeItem('token');
    throw error;
  }
};

/**
 * Get current authenticated user
 * @returns {Promise<Object>} Current user data
 */
const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const authService = {
  login,
  logout,
  getCurrentUser
};

export default authService;