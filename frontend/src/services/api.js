// File: /frontend/src/services/api.js
// Enhanced API service with improved error handling and token management

import axios from 'axios';
import { showToast } from '../config/toast';

// Create axios instance with base URL from environment
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Include cookies in requests for JWT auth
});

// Track retry attempts for failed requests
const retryAttempts = new Map();
const MAX_RETRIES = 2;

// Add request interceptor for auth headers and tracking
api.interceptors.request.use(
  (config) => {
    // Add authentication token from localStorage if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request ID for retry tracking
    if (!config.requestId) {
      config.requestId = Math.random().toString(36).substring(2, 15);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling and retries
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Skip retry for explicitly cancelled requests
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }
    
    // Determine if request should be retried
    const shouldRetry = (
      // Server errors (5xx)
      (error.response && error.response.status >= 500 && error.response.status < 600) ||
      // Network errors (no response)
      !error.response ||
      // Timeout errors
      error.code === 'ECONNABORTED'
    );
    
    // Get current retry count for this request
    const retryCount = retryAttempts.get(originalRequest.requestId) || 0;
    
    // Retry logic for qualifying requests
    if (shouldRetry && retryCount < MAX_RETRIES && originalRequest) {
      // Increment retry count
      retryAttempts.set(originalRequest.requestId, retryCount + 1);
      
      // Exponential backoff delay
      const delay = Math.pow(2, retryCount) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Retry the request
      return api(originalRequest);
    }
    
    // Handle authentication errors (401)
    if (error.response?.status === 401) {
      // Clear token from storage
      localStorage.removeItem('token');
      
      // Only show toast for actual auth errors, not initial auth checks
      const isAuthCheck = originalRequest.url === '/auth/me' || 
                         originalRequest.url.includes('/auth/spotify') ||
                         originalRequest.url === '/auth/logout';
                         
      if (!isAuthCheck) {
        showToast.error('Your session has expired. Please log in again.');
        
        // Optionally redirect to login page
        // window.location.href = '/login';
      }
    }
    
    // Cleanup retry counter
    if (originalRequest?.requestId) {
      retryAttempts.delete(originalRequest.requestId);
    }
    
    return Promise.reject(error);
  }
);

export default api;