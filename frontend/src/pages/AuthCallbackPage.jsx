// File: /frontend/src/pages/AuthCallbackPage.jsx
// Universal authentication callback handler for OAuth flows

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { showToast } from '../config/toast';
import { FaHeadphones, FaMusic, FaCheckCircle, FaExclamationTriangle, FaHome } from 'react-icons/fa';

const AuthCallbackPage = () => {
  // State for handling the authentication process
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processing authentication...');
  const [errorDetails, setErrorDetails] = useState('');
  
  // Hooks
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  
  useEffect(() => {
    const processAuthCallback = async () => {
      try {
        // Extract query parameters from URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const token = urlParams.get('token');
        const error = urlParams.get('error');
        const success = urlParams.get('success') === 'true';
        const details = urlParams.get('details');
        
        // Handle error in callback
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
        
        // Handle success with token
        if (success && token) {
          // Store token in localStorage
          localStorage.setItem('token', token);
          
          // Verify authentication worked
          await checkAuth();
          
          setStatus('success');
          setMessage('Successfully authenticated!');
          
          // Show success toast
          showToast.success('Successfully logged in!');
          
          // Redirect after short delay
          setTimeout(() => {
            navigate('/settings');
          }, 1500);
          return;
        }
        
        // If we have a code but no token/success flag, 
        // this might be a direct callback from Spotify - let the backend handle it
        if (code) {
          setStatus('processing');
          setMessage('Authorization code received, processing...');
          
          // The backend will handle the redirect
          // This should normally not happen in the single-page application flow
          // but we handle it just in case
          setTimeout(() => {
            setStatus('error');
            setMessage('Unexpected authentication flow. Please try again.');
            setErrorDetails('Received authorization code but not in expected format.');
          }, 3000);
          return;
        }
        
        // If we reach here, something unexpected happened
        setStatus('error');
        setMessage('Unexpected authentication response');
        setErrorDetails('Missing expected authentication parameters');
        
      } catch (err) {
        console.error('Auth callback error:', err);
        setStatus('error');
        setMessage('Authentication process failed');
        setErrorDetails(err.message || 'Unknown error occurred');
        showToast.error('Authentication failed. Please try again.');
      }
    };
    
    processAuthCallback();
  }, [navigate, checkAuth]);
  
  return (
    <div className="auth-callback">
      <div className="auth-callback__card">
        <div className="auth-callback__header">
          <div className="auth-callback__logo">
            <FaMusic className="auth-callback__logo-icon" />
          </div>
          <h1 className="auth-callback__title">Music Activity</h1>
          <h2 className="auth-callback__subtitle">Authentication</h2>
        </div>
        
        <div className={`auth-callback__status auth-callback__status--${status}`}>
          {status === 'processing' && (
            <div className="auth-callback__processing">
              <div className="spinner"></div>
              <p className="auth-callback__message">{message}</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="auth-callback__success">
              <FaCheckCircle className="auth-callback__status-icon" />
              <p className="auth-callback__message">{message}</p>
              <p className="auth-callback__info">Redirecting to your profile...</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="auth-callback__error">
              <FaExclamationTriangle className="auth-callback__status-icon" />
              <p className="auth-callback__message">{message}</p>
              
              {errorDetails && (
                <p className="auth-callback__error-details">{errorDetails}</p>
              )}
              
              <div className="auth-callback__actions">
                <Link to="/login" className="btn btn-primary">
                  Try Again
                </Link>
                <Link to="/" className="btn btn-outline">
                  <FaHome className="mr-sm" />
                  Go to Homepage
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthCallbackPage;