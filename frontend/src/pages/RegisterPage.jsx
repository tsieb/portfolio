// File: /frontend/src/pages/RegisterPage.jsx
// User registration page

import { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { showToast } from '../config/toast';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaMusic, 
  FaUserPlus, 
  FaSignInAlt 
} from 'react-icons/fa';

const RegisterPage = () => {
  const { register, isAuthenticated, isLoading, error, resetError } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (!/^[a-zA-Z0-9_-]{3,20}$/.test(formData.username)) {
      errors.username = 'Username must be 3-20 characters and contain only letters, numbers, underscores and hyphens';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Email address is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      showToast.success('Registration successful!');
      navigate('/settings');
    } catch (err) {
      // Error is handled by the auth context and displayed below
      showToast.error('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSpotifyRegister = () => {
    // Redirect to backend Spotify OAuth endpoint
    window.location.href = `${import.meta.env.VITE_API_URL || '/api'}/auth/spotify`;
  };
  
  return (
    <div className={`register-page ${isVisible ? 'is-visible' : ''}`}>
      <div className="register-card">
        <div className="register-card__header">
          <div className="register-card__logo">
            <FaMusic className="register-card__logo-icon" />
          </div>
          <h1 className="register-card__title">Create Account</h1>
          <p className="register-card__subtitle">Join and share your music activity</p>
        </div>
        
        <div className="register-card__content">
          {error && (
            <div className="register-card__error">
              <FaUser className="register-card__error-icon" />
              <span>{error}</span>
            </div>
          )}
          
          <button 
            onClick={handleSpotifyRegister}
            className="btn btn-spotify register-form__spotify"
            disabled={isSubmitting}
          >
            <FaMusic className="btn-spotify__icon" />
            Sign up with Spotify
          </button>
          
          <div className="register-form__divider">
            <span>or sign up with email</span>
          </div>
          
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <div className="form-input-group">
                <div className="form-input-icon">
                  <FaUser />
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className={`form-input form-input--with-icon ${formErrors.username ? 'form-input--error' : ''}`}
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  disabled={isSubmitting}
                />
              </div>
              {formErrors.username && (
                <div className="form-error">{formErrors.username}</div>
              )}
              <div className="form-help">This will be your profile URL: music.example.com/{formData.username || 'username'}</div>
            </div>
            
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
                  placeholder="Your email address"
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
                  placeholder="Create a password"
                  disabled={isSubmitting}
                  autoComplete="new-password"
                />
              </div>
              {formErrors.password && (
                <div className="form-error">{formErrors.password}</div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <div className="form-input-group">
                <div className="form-input-icon">
                  <FaLock />
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`form-input form-input--with-icon ${formErrors.confirmPassword ? 'form-input--error' : ''}`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  disabled={isSubmitting}
                  autoComplete="new-password"
                />
              </div>
              {formErrors.confirmPassword && (
                <div className="form-error">{formErrors.confirmPassword}</div>
              )}
            </div>
            
            <div className="register-form__terms">
              <div className="form-checkbox">
                <input 
                  type="checkbox" 
                  id="terms" 
                  name="terms"
                  required
                />
                <label htmlFor="terms">
                  I agree to the <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a>
                </label>
              </div>
            </div>
            
            <button
              type="submit"
              className="btn btn-primary register-form__submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner spinner--sm mr-sm"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <FaUserPlus className="mr-sm" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>
          
          <div className="register-form__footer">
            <p>Already have an account?</p>
            <Link to="/login" className="register-form__login">
              <FaSignInAlt className="mr-sm" />
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;