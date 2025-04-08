// /frontend/src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import authService from '@services/authService';

const AuthContext = createContext();

/**
 * Provider component for authentication context
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} AuthProvider component
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in (token in localStorage)
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const userData = await authService.checkAuthStatus();
        setUser(userData);
      } catch (err) {
        console.error('Authentication check failed:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  /**
   * Login user with credentials
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   */
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await authService.login(credentials);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout current user
   */
  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
    } catch (err) {
      setError(err.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook for accessing authentication context
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};