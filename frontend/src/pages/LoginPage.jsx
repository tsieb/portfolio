// File: /frontend/src/pages/LoginPage.jsx
// Updated login page with music icons instead of Spotify ones

import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { FaHeadphones, FaMusic } from 'react-icons/fa';
import '../assets/styles/pages/LoginPage.scss';

const LoginPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  
  // If already authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // Animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleMusicLogin = () => {
    // Redirect to backend OAuth endpoint
    window.location.href = `${import.meta.env.VITE_API_URL || '/api'}/auth/spotify`;
  };
  
  if (isLoading) {
    return (
      <div className="login-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`login-page ${isVisible ? 'is-visible' : ''}`}>
      <div className="login-card">
        <div className="login-card__header">
          <div className="login-card__logo">
            <FaHeadphones className="login-card__logo-icon" />
          </div>
          <h1 className="login-card__title">Welcome to Music Activity</h1>
          <p className="login-card__subtitle">Share your listening habits with the world</p>
        </div>
        
        <div className="login-card__content">
          <button 
            onClick={handleMusicLogin}
            className="btn btn-spotify login-form__spotify"
          >
            <FaMusic className="btn-spotify__icon" />
            Continue with Music Service
          </button>
          
          <div className="login-form__info">
            <p>By continuing, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.</p>
            <p>We'll never post to your account without your permission.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;