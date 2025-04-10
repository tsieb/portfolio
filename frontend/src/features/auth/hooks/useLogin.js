// File: /frontend/src/features/auth/hooks/useLogin.js
// Custom hook for login functionality

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const useLogin = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  
  // Animation effect on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle music service login
  const handleMusicLogin = () => {
    // Redirect to backend OAuth endpoint
    window.location.href = `${apiUrl}/auth/spotify`;
  };

  return {
    isAuthenticated,
    isLoading,
    isVisible,
    handleMusicLogin
  };
};