// File: /frontend/src/pages/AdminLoginPage.jsx
// Admin login page with link back to main login

import { useState, useEffect } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { showToast } from '../config/toast';
import { FaLock, FaEnvelope, FaUserShield, FaArrowLeft } from 'react-icons/fa';

const AdminLoginPage = () => {
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
  
  // If already authenticated as admin, redirect to admin dashboard
  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  
  // If authenticated but not admin, redirect to home
  if (isAuthenticated && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
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
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="admin-login-page">
        <div className="page-loading">
          <div className="spinner spinner--lg page-loading__spinner"></div>
          <p className="page-loading__text">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`admin-login-page ${isVisible ? 'is-visible' : ''}`}>
      <div className="card">
        <div className="card__header">
          <div className="flex-center mb-md">
            <FaUserShield className="text-electric-cyan" style={{ fontSize: '3rem' }} />
          </div>
          <h1 className="text-center">Admin Login</h1>
          <p className="text-center text-secondary mb-lg">Secure access for administrators only</p>
        </div>
        
        <div className="card__body">
          {error && (
            <div className="alert alert--error mb-lg">
              <FaLock className="alert__icon" />
              <div className="alert__content">
                <span>{error}</span>
              </div>
            </div>
          )}
          
          <form className="form" onSubmit={handleSubmit} noValidate>
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
                  placeholder="Enter your admin email"
                  disabled={isSubmitting}
                  autoComplete="email"
                  required
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
                  required
                />
              </div>
              {formErrors.password && (
                <div className="form-error">{formErrors.password}</div>
              )}
            </div>
            
            <button
              type="submit"
              className="btn btn-primary w-full mb-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner spinner--sm mr-sm"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In to Admin</span>
              )}
            </button>
          </form>
          
          <Link to="/login" className="btn btn-text flex-center">
            <FaArrowLeft className="mr-sm" />
            Back to main login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;