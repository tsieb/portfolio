// File: /frontend/src/features/user/hooks/useUserProfile.js
// Custom hook for user profile functionality

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import userService from '../services/userApi';

export const useUserProfile = () => {
  const { username } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const data = await userService.getUserProfile(username);
        setUserProfile(data);
        
        // Check if current user is the profile owner
        if (isAuthenticated && currentUser) {
          setIsOwner(currentUser.username === username);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err.response?.data?.message || 'Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };
    
    if (username) {
      fetchUserProfile();
    }
  }, [username, isAuthenticated, currentUser]);

  return {
    userProfile,
    loading,
    error,
    isOwner,
    username
  };
};