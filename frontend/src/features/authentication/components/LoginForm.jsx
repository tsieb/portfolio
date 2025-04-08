// /frontend/src/features/authentication/components/LoginForm.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from '@assets/styles/features/authentication/LoginForm.module.scss';

/**
 * Login form component
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Form submission handler
 * @param {boolean} props.loading - Whether form is in loading state
 * @param {string} props.initialError - Initial error message
 * @returns {JSX.Element} LoginForm component
 */
const LoginForm = ({ onSubmit, loading, initialError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState(initialError || '');
  const [touched, setTouched] = useState({ email: false, password: false });
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form validation
    if (!email.trim()) {
      setFormError('Email is required');
      return;
    }
    
    if (!password) {
      setFormError('Password is required');
      return;
    }
    
    // Clear error and submit form
    setFormError('');
    onSubmit({ email, password });
  };
  
  // Mark field as touched when blurred
  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };
  
  // Validation functions
  const getEmailError = () => {
    if (!email.trim() && touched.email) {
      return 'Email is required';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email) && touched.email) {
      return 'Please enter a valid email address';
    }
    
    return '';
  };
  
  const getPasswordError = () => {
    if (!password && touched.password) {
      return 'Password is required';
    }
    return '';
  };
  
  const emailError = getEmailError();
  const passwordError = getPasswordError();
  
  return (
    <form className={styles.loginForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>Email</label>
        <input
          id="email"
          type="email"
          className={`${styles.input} ${emailError ? styles.inputError : ''}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => handleBlur('email')}
          disabled={loading}
          placeholder="admin@example.com"
          autoComplete="email"
        />
        {emailError && <p className={styles.errorText}>{emailError}</p>}
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>Password</label>
        <input
          id="password"
          type="password"
          className={`${styles.input} ${passwordError ? styles.inputError : ''}`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => handleBlur('password')}
          disabled={loading}
          placeholder="••••••••"
          autoComplete="current-password"
        />
        {passwordError && <p className={styles.errorText}>{passwordError}</p>}
      </div>
      
      {formError && (
        <div className={styles.formError}>
          {formError}
        </div>
      )}
      
      <button 
        type="submit" 
        className={styles.submitButton}
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Log In'}
      </button>
      
      <div className={styles.demoInfo}>
        <p>For demo purposes, use:</p>
        <p>Email: admin@example.com</p>
        <p>Password: adminpassword</p>
      </div>
    </form>
  );
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  initialError: PropTypes.string
};

LoginForm.defaultProps = {
  loading: false,
  initialError: ''
};

export default LoginForm;