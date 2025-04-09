// File: /frontend/src/pages/LoginPage.jsx
// Enhanced login page with Spotify authentication

import { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { showToast } from '../config/toast';
import { 
  FaLock, 
  FaEnvelope, 
  FaSpotify, 
  FaSignInAlt, 
  FaUserPlus 
} from 'react-icons/fa';
import '../assets/styles/pages/LoginPage.scss';

const LoginPage = () => {
  const { login, isAuthenticated, isLoading, error, resetError } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear field error when typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
    
    // Clear global error when typing
    if (error) {
      resetError();
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Email address is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await login(formData.email, formData.password);
      showToast.success('Login successful!');
      navigate('/');
    } catch (err) {
      // Error is handled by the auth context and displayed below
      showToast.error('Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSpotifyLogin = () => {
    // Redirect to backend Spotify OAuth endpoint
    window.location.href = `${import.meta.env.VITE_API_URL || '/api'}/auth/spotify`;
  };
  
  return (
    <div className={`login-page ${isVisible ? 'is-visible' : ''}`}>
      <div className="login-card">
        <div className="login-card__header">
          <div className="login-card__logo">
            <FaSpotify className="login-card__logo-icon" />
          </div>
          <h1 className="login-card__title">Welcome Back</h1>
          <p className="login-card__subtitle">Login to your music activity profile</p>
        </div>
        
        <div className="login-card__content">
          {error && (
            <div className="login-card__error">
              <FaLock className="login-card__error-icon" />
              <span>{error}</span>
            </div>
          )}
          
          <button 
            onClick={handleSpotifyLogin}
            className="btn btn-spotify login-form__spotify"
            disabled={isSubmitting}
          >
            <FaSpotify className="btn-spotify__icon" />
            Continue with Spotify
          </button>
          
          <div className="login-form__divider">
            <span>or login with email</span>
          </div>
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <div className="form-input-group">
                <div className="form-input-icon">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-input form-input--with-icon ${formErrors.email ? 'form-input--error' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled={isSubmitting}
                  autoComplete="email"
                />
              </div>
              {formErrors.email && (
                <div className="form-error">{formErrors.email}</div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="form-input-group">
                <div className="form-input-icon">
                  <FaLock />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`form-input form-input--with-icon ${formErrors.password ? 'form-input--error' : ''}`}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                  autoComplete="current-password"
                />
              </div>
              {formErrors.password && (
                <div className="form-error">{formErrors.password}</div>
              )}
            </div>
            
            <div className="login-form__options">
              <div className="form-checkbox">
                <input 
                  type="checkbox" 
                  id="remember" 
                  name="remember"
                />
                <label htmlFor="remember">Remember me</label>
              </div>
              
              <Link to="/forgot-password" className="login-form__forgot">
                Forgot password?
              </Link>
            </div>
            
            <button
              type="submit"
              className="btn btn-primary login-form__submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner spinner--sm mr-sm"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <FaSignInAlt className="mr-sm" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
          
          <div className="login-form__footer">
            <p>Don't have an account?</p>
            <Link to="/register" className="login-form__register">
              <FaUserPlus className="mr-sm" />
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;