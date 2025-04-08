import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authService, IUser, ILoginData } from '../services/authService';

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

// Create context with undefined default value
const AuthContext = createContext<IAuthContext | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication provider component
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());
  const [user, setUser] = useState<IUser | null>(authService.getUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for token expiration or changes
  useEffect(() => {
    const validateAuth = async () => {
      // Only try to validate if we have a token
      if (authService.getToken()) {
        try {
          // Get current user from API to validate token
          await authService.getCurrentUser();
        } catch (err) {
          // If we get an error, the token might be invalid or expired
          logout();
        }
      }
    };

    validateAuth();
  }, []);

  /**
   * Login function
   */
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const loginData: ILoginData = { email, password };
      const authData = await authService.login(loginData);
      
      authService.setAuth(authData);
      setIsAuthenticated(true);
      setUser(authData.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout function
   */
  const logout = () => {
    authService.clearAuth();
    setIsAuthenticated(false);
    setUser(null);
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