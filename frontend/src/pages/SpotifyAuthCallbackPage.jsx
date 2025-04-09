// File: /frontend/src/pages/SpotifyAuthCallbackPage.jsx
// Enhanced Spotify OAuth callback handling with improved error reporting

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpotify, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../features/auth/hooks/useAuth';
import authService from '../features/auth/services/authApi';
import { showToast } from '../config/toast';

const SpotifyAuthCallbackPage = () => {
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processing Spotify authentication...');
  const [errorDetails, setErrorDetails] = useState('');
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
        console.log('Sending code to backend:', code.substring(0, 10) + '...');
        
        try {
          const tokenData = await authService.exchangeSpotifyCode(code);
          
          // Log in with Spotify tokens
          setMessage('Logging in with Spotify...');
          await loginWithSpotify(tokenData);
          
          setStatus('success');
          setMessage('Successfully connected with Spotify!');
          
          // Show success toast
          showToast.success('Connected to Spotify successfully!');
          
          // Redirect after success
          setTimeout(() => {
            navigate('/settings');
          }, 2000);
        } catch (err) {
          console.error('Token exchange failed:', err);
          setStatus('error');
          setMessage('Failed to exchange authorization code. Please try again.');
          setErrorDetails(err.message || 'Unknown error');
          
          // Show error toast
          showToast.error('Connection to Spotify failed. Please try again.');
        }
      } catch (err) {
        console.error('Spotify auth error:', err);
        setStatus('error');
        setMessage(err.message || 'Failed to authenticate with Spotify');
        setErrorDetails(JSON.stringify(err, null, 2));
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
          
          {status === 'error' && errorDetails && (
            <div className="spotify-callback__error-details">
              <small>{errorDetails}</small>
            </div>
          )}
          
          {status === 'error' && (
            <button 
              className="btn btn-primary mt-md"
              onClick={() => navigate('/login')}
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpotifyAuthCallbackPage;