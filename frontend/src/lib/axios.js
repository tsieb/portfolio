// /frontend/src/lib/axios.js
import axios from 'axios';

/**
 * Axios instance with base configuration
 */
const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor for adding token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('authToken');
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 (Unauthorized) errors - token expired or invalid
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      // Could dispatch an action to update auth state or redirect
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;