import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import api from '../lib/axios';

/**
 * Authentication context interface
 */
interface IAuthContext {
  isAuthenticated: boolean;
  user: IUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

/**
 * User interface
 */
interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Create context with undefined default value
const AuthContext = createContext<IAuthContext | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication provider component
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        // If user data is invalid, log them out
        logout();
      }
    }
  }, []);

  /**
   * Login function
   */
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would make an API call to authenticate
      // Simulated API call for development
      try {
        const response = await api.post('/auth/login', { email, password });
        const { token, user } = response.data.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        setIsAuthenticated(true);
        setUser(user);
      } catch (apiError: any) {
        setError(apiError.response?.data?.message || 'Login failed');
        throw apiError;
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout function
   */
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Context value
  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use the auth context
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};