// File: /frontend/src/pages/LoginPage.jsx
// Login page focused on Spotify authentication

import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { FaSpotify } from 'react-icons/fa';
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
  
  const handleSpotifyLogin = () => {
    // Redirect to backend Spotify OAuth endpoint
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
            <FaSpotify className="login-card__logo-icon" />
          </div>
          <h1 className="login-card__title">Welcome to Music Activity</h1>
          <p className="login-card__subtitle">Share your listening habits with the world</p>
        </div>
        
        <div className="login-card__content">
          <button 
            onClick={handleSpotifyLogin}
            className="btn btn-spotify login-form__spotify"
          >
            <FaSpotify className="btn-spotify__icon" />
            Continue with Spotify
          </button>
          
          <div className="login-form__info">
            <p>By continuing, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.</p>
            <p>We'll never post to Spotify without your permission.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;