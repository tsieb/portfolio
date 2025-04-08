// /frontend/src/pages/AdminLoginPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import LoginForm from '@features/authentication/components/LoginForm';
import styles from '@assets/styles/pages/AdminLoginPage.module.scss';

/**
 * Admin login page component
 * @returns {JSX.Element} AdminLoginPage component
 */
const AdminLoginPage = () => {
  const { login, isAuthenticated, isAdmin, loading, error } = useAuth();
  const [loginError, setLoginError] = useState(null);
  const navigate = useNavigate();
  
  // Redirect if already authenticated as admin
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate]);
  
  // Set page title
  useEffect(() => {
    document.title = 'Admin Login | Space Portfolio';
  }, []);
  
  // Handle login form submission
  const handleLogin = async (credentials) => {
    try {
      setLoginError(null);
      const user = await login(credentials);
      
      if (user.role !== 'admin') {
        setLoginError('Access denied. Admin privileges required.');
        return;
      }
      
      navigate('/admin/dashboard');
    } catch (error) {
      setLoginError(error.message || 'Login failed. Please try again.');
    }
  };
  
  return (
    <div className={styles.adminLoginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginHeader}>
          <h1 className={styles.title}>Admin Access</h1>
          <p className={styles.subtitle}>Login to manage your portfolio</p>
        </div>
        
        {loginError && (
          <div className={styles.errorMessage}>
            {loginError}
          </div>
        )}
        
        <LoginForm 
          onSubmit={handleLogin} 
          loading={loading} 
          initialError={error}
        />
      </div>
    </div>
  );
};

export default AdminLoginPage;