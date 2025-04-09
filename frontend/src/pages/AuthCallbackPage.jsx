// File: /frontend/src/pages/AuthCallbackPage.jsx
// Enhanced Spotify OAuth callback handler with proper token exchange


import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeadphones, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../features/auth/hooks/useAuth';
import { showToast } from '../config/toast';

const AuthCallbackPage = () => {
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processing authentication...');
  const [errorDetails, setErrorDetails] = useState('');
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  
  useEffect(() => {
    const processAuth = async () => {
      try {
        // Get query parameters from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const success = urlParams.get('success') === 'true';
        const error = urlParams.get('error');
        const details = urlParams.get('details');
        const token = urlParams.get('token');
        
        if (error) {
          console.error('Auth error:', error, details);
          setStatus('error');
          setMessage(`Authentication failed: ${error}`);
          if (details) {
            setErrorDetails(details);
          }
          showToast.error('Login failed. Please try again.');
          return;
        }
        
        if (success && token) {
          // Store the token provided by the server
          localStorage.setItem('token', token);
          
          // Check authentication status to update auth context
          await checkAuth();
          
          setStatus('success');
          setMessage('Successfully authenticated!');
          showToast.success('Successfully connected to music service!');
          
          // Redirect after success
          setTimeout(() => {
            navigate('/settings');
          }, 2000);
          return;
        }
        
        // If we don't have success or error, something unexpected happened
        setStatus('error');
        setMessage('Unexpected authentication response. Please try again.');
        showToast.error('Authentication failed with an unexpected response.');
        
      } catch (err) {
        console.error('Auth callback processing error:', err);
        setStatus('error');
        setMessage('Failed to process authentication response');
        setErrorDetails(err.message || 'Unknown error');
        showToast.error('Authentication failed. Please try again.');
      }
    };
    
    processAuth();
  }, [navigate, checkAuth]);
  
  return (
    <div className="auth-callback">
      <div className="auth-callback__card">
        <div className="auth-callback__icon">
          <FaHeadphones />
        </div>
        <h1 className="auth-callback__title">Authentication</h1>
        
        <div className={`auth-callback__status auth-callback__status--${status}`}>
          {status === 'processing' && (
            <div className="spinner spinner--primary"></div>
          )}
          
          {status === 'success' && (
            <FaCheckCircle className="auth-callback__status-icon" />
          )}
          
          {status === 'error' && (
            <FaExclamationTriangle className="auth-callback__status-icon" />
          )}
          
          <p className="auth-callback__message">{message}</p>
          
          {status === 'error' && errorDetails && (
            <div className="auth-callback__error-details">
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

export default AuthCallbackPage;