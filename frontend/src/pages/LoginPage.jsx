// File: /frontend/src/pages/LoginPage.jsx
// Login page with music service authentication

import { Navigate } from 'react-router-dom';
import { useLogin } from '../features/auth/hooks/useLogin';
import LoginCard from '../features/auth/components/LoginCard';

const LoginPage = () => {
  const { isAuthenticated, isLoading, isVisible, handleMusicLogin } = useLogin();
  
  // If already authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="login-page">
        <div className="loading">
          <div className="spinner spinner--lg loading__spinner"></div>
          <p className="loading__text">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`login-page ${isVisible ? 'is-visible' : ''}`}>
      <div className="container">
        <LoginCard onMusicLogin={handleMusicLogin} />
      </div>
    </div>
  );
};

export default LoginPage;