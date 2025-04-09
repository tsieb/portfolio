// File: /frontend/src/services/api.js
// API service for making HTTP requests

import axios from 'axios';

// Create axios instance with base URL from environment
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Include cookies in requests
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token to request if it exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle token expiration or auth errors
    if (error.response?.status === 401) {
      // Clear local storage on auth error
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;