// File: /frontend/src/pages/SpotifyAuthCallbackPage.jsx
// Handles Spotify OAuth callback and token exchange

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpotify, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../features/auth/hooks/useAuth';
import authService from '../features/auth/services/authApi';

const SpotifyAuthCallbackPage = () => {
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processing Spotify authentication...');
  const navigate = useNavigate();
  const { loginWithSpotify } = useAuth();
  
  useEffect(() => {
    const processSpotifyAuth = async () => {
      try {
        // Get code from URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        
        if (error) {
          setStatus('error');
          setMessage(`Authentication failed: ${error}`);
          return;
        }
        
        if (!code) {
          setStatus('error');
          setMessage('No authorization code provided');
          return;
        }
        
        // Exchange code for tokens
        setMessage('Exchanging code for access token...');
        const tokenData = await authService.exchangeSpotifyCode(code);
        
        // Log in with Spotify tokens
        setMessage('Logging in with Spotify...');
        await loginWithSpotify(tokenData);
        
        setStatus('success');
        setMessage('Successfully connected with Spotify!');
        
        // Redirect after success
        setTimeout(() => {
          navigate('/settings');
        }, 2000);
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Failed to authenticate with Spotify');
        console.error('Spotify auth error:', err);
      }
    };
    
    processSpotifyAuth();
  }, [navigate, loginWithSpotify]);
  
  return (
    <div className="spotify-callback">
      <div className="spotify-callback__card">
        <div className="spotify-callback__icon">
          <FaSpotify />
        </div>
        <h1 className="spotify-callback__title">Spotify Connection</h1>
        
        <div className={`spotify-callback__status spotify-callback__status--${status}`}>
          {status === 'processing' && (
            <div className="spinner spinner--primary"></div>
          )}
          
          {status === 'success' && (
            <FaCheckCircle className="spotify-callback__status-icon" />
          )}
          
          {status === 'error' && (
            <FaExclamationTriangle className="spotify-callback__status-icon" />
          )}
          
          <p className="spotify-callback__message">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default SpotifyAuthCallbackPage;