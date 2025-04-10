// File: /frontend/src/pages/LoginPage.jsx
// Login page with music service authentication

import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { showToast } from '../config/toast';
import { FaHeadphones, FaMusic } from 'react-icons/fa';

const LoginPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  
  // If already authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
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
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="login-page">
        <div className="page-loading">
          <div className="spinner spinner--lg page-loading__spinner"></div>
          <p className="page-loading__text">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`login-page ${isVisible ? 'is-visible' : ''}`}>
      <div className="container">
        <div className="card mx-auto" style={{ maxWidth: '450px' }}>
          <div className="card__header">
            <div className="flex-center mb-md">
              <FaHeadphones className="text-electric-cyan" style={{ fontSize: '3rem' }} />
            </div>
            <h1 className="text-center">Welcome to Music Activity</h1>
            <p className="text-center text-secondary mb-lg">Share your listening habits with the world</p>
          </div>
          
          <div className="card__body">
            <button 
              onClick={handleMusicLogin}
              className="btn btn-gradient w-full mb-lg"
              aria-label="Continue with Music Service"
            >
              <FaMusic className="mr-sm" />
              Continue with Music Service
            </button>
            
            <div className="text-center text-small text-tertiary">
              <p>By continuing, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.</p>
              <p>We'll never post to your account without your permission.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;