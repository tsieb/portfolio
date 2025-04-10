// File: /frontend/src/features/admin/hooks/useAdminLogin.js
// Custom hook for admin login functionality

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { showToast } from '../../../config/toast';

export const useAdminLogin = () => {
  const { adminLogin, isAuthenticated, isAdmin, isLoading, error, resetError } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  // UI state
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Handle animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear global error when typing
    if (error) {
      resetError();
    }
  };
  
  // Form validation
  const validateForm = () => {
    const errors = {};
    
    // Validate email
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    // Validate password
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await adminLogin(formData.email, formData.password);
      
      showToast.success('Login successful!');
      navigate('/admin');
    } catch (err) {
      // Error will be handled by AuthContext and displayed at bottom of form
      showToast.error('Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isAuthenticated,
    isAdmin,
    isLoading,
    error,
    formData,
    formErrors,
    isSubmitting,
    isVisible,
    handleChange,
    handleSubmit
  };
};