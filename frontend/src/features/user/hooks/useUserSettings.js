// File: /frontend/src/features/user/hooks/useUserSettings.js
// Custom hook for user settings functionality

import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import userService from '../services/userApi';
import { showToast } from '../../../config/toast';

export const useUserSettings = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    bio: '',
    isPublic: true,
    allowedViewers: []
  });
  
  // Load user data on mount
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        username: user.username || '',
        bio: user.bio || '',
        isPublic: user.isPublic !== undefined ? user.isPublic : true,
        allowedViewers: user.allowedViewers || []
      });
    }
  }, [user]);
  
  // Handle form input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const updatedUser = await userService.updateUserProfile(formData);
      updateUser(updatedUser);
      showToast.success('Profile settings updated successfully');
    } catch (err) {
      showToast.error(err.message || 'Failed to update profile settings');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    formData,
    handleChange,
    handleSubmit
  };
};