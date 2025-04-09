// File: /frontend/src/services/api.js
// Enhanced API service with improved error handling for auth errors

import axios from 'axios';
import { showToast } from '../config/toast';

// Create axios instance with base URL from environment
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Include cookies in requests
});

// Track retry attempts
const retryAttempts = new Map();
const MAX_RETRIES = 2;

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token to request if it exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Generate request ID for retry tracking if not exists
    if (!config.requestId) {
      config.requestId = Math.random().toString(36).substring(2, 15);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // No retry for explicitly cancelled requests
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }
    
    // Check if we should retry (server errors or network issues)
    const shouldRetry = (
      (error.response && error.response.status >= 500 && error.response.status < 600) ||
      !error.response ||
      error.code === 'ECONNABORTED'
    );
    
    // Get current retry count
    const retryCount = retryAttempts.get(originalRequest.requestId) || 0;
    
    // If should retry and under max attempts
    if (shouldRetry && retryCount < MAX_RETRIES && originalRequest) {
      retryAttempts.set(originalRequest.requestId, retryCount + 1);
      
      // Exponential backoff
      const delay = Math.pow(2, retryCount) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Log retry attempt
      console.log(`Retrying request (attempt ${retryCount + 1}/${MAX_RETRIES})`, 
                  originalRequest.url);
      
      return api(originalRequest);
    }
    
    // Handle auth errors
    if (error.response?.status === 401) {
      // Clear local storage on auth error
      localStorage.removeItem('token');
      
      // Only show toast for actual auth errors, not initial page load checks
      // Added check for auth endpoints and initial loading checks
      const isAuthCheck = originalRequest.url === '/auth/me' || 
                         originalRequest.url.includes('/auth/spotify') ||
                         originalRequest.url === '/auth/logout';
                         
      if (!isAuthCheck) {
        showToast.error('Your session has expired. Please log in again.');
      }
    }
    
    // Clean up retry counter
    if (originalRequest?.requestId) {
      retryAttempts.delete(originalRequest.requestId);
    }
    
    return Promise.reject(error);
  }
);

export default api;