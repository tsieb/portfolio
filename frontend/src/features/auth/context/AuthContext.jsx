// File: /frontend/src/features/auth/context/AuthContext.jsx
// Improved authentication context with cleaner state management and error handling

import { createContext, useReducer, useCallback, useEffect } from 'react';
import authService from '../services/authApi';
import { showToast } from '../../../config/toast';

// Action types
const AUTH_ACTIONS = {
  AUTH_START: 'AUTH_START',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAIL: 'AUTH_FAIL',
  AUTH_LOGOUT: 'AUTH_LOGOUT',
  AUTH_RESET_ERROR: 'AUTH_RESET_ERROR',
  AUTH_UPDATE_USER: 'AUTH_UPDATE_USER'
};

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  error: null
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.AUTH_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
      
    case AUTH_ACTIONS.AUTH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        isAdmin: action.payload?.role === 'admin',
        user: action.payload,
        error: null
      };
      
    case AUTH_ACTIONS.AUTH_FAIL:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        isAdmin: false,
        user: null,
        error: action.payload
      };
      
    case AUTH_ACTIONS.AUTH_LOGOUT:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        isAdmin: false,
        user: null,
        error: null
      };
      
    case AUTH_ACTIONS.AUTH_RESET_ERROR:
      return {
        ...state,
        error: null
      };
      
    case AUTH_ACTIONS.AUTH_UPDATE_USER:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };
      
    default:
      return state;
  }
};

// Create context
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);
  
  /**
   * Login with admin credentials
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   * @returns {Promise<Object>} User data
   */
  const adminLogin = useCallback(async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.AUTH_START });
    
    try {
      const response = await authService.adminLogin(email, password);
      
      if (!response || !response.data || !response.data.user) {
        throw new Error('Invalid response from server');
      }
      
      dispatch({ 
        type: AUTH_ACTIONS.AUTH_SUCCESS, 
        payload: response.data.user 
      });
      
      return response.data.user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          'Authentication failed. Please check your credentials.';
      
      dispatch({ 
        type: AUTH_ACTIONS.AUTH_FAIL, 
        payload: errorMessage
      });
      
      throw error;
    }
  }, []);
  
  /**
   * Login with Spotify OAuth token data
   * @param {Object} tokenData - Spotify token data
   * @returns {Promise<Object>} User data
   */
  const loginWithSpotify = useCallback(async (tokenData) => {
    dispatch({ type: AUTH_ACTIONS.AUTH_START });
    
    try {
      const response = await authService.loginWithSpotify(tokenData);
      
      if (!response || !response.data || !response.data.user) {
        throw new Error('Invalid response from server');
      }
      
      dispatch({ 
        type: AUTH_ACTIONS.AUTH_SUCCESS, 
        payload: response.data.user 
      });
      
      return response.data.user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          'Authentication with Spotify failed. Please try again.';
      
      dispatch({ 
        type: AUTH_ACTIONS.AUTH_FAIL, 
        payload: errorMessage
      });
      
      throw error;
    }
  }, []);
  
  /**
   * Register with email and password
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} User data
   */
  const register = useCallback(async (userData) => {
    dispatch({ type: AUTH_ACTIONS.AUTH_START });
    
    try {
      const response = await authService.register(userData);
      
      if (!response || !response.data || !response.data.user) {
        throw new Error('Invalid response from server');
      }
      
      dispatch({ 
        type: AUTH_ACTIONS.AUTH_SUCCESS, 
        payload: response.data.user 
      });
      
      return response.data.user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          'Registration failed. Please try again.';
      
      dispatch({ 
        type: AUTH_ACTIONS.AUTH_FAIL, 
        payload: errorMessage
      });
      
      throw error;
    }
  }, []);
  
  /**
   * Logout user
   * @returns {Promise<void>}
   */
  const logout = useCallback(async () => {
    dispatch({ type: AUTH_ACTIONS.AUTH_START });
    
    try {
      await authService.logout();
      dispatch({ type: AUTH_ACTIONS.AUTH_LOGOUT });
      showToast.info('You have been logged out');
    } catch (error) {
      // Force logout even if API call fails
      dispatch({ type: AUTH_ACTIONS.AUTH_LOGOUT });
    }
  }, []);
  
  /**
   * Check if user is authenticated
   * @returns {Promise<Object|null>} User data or null
   */
  const checkAuth = useCallback(async () => {
    dispatch({ type: AUTH_ACTIONS.AUTH_START });
    
    try {
      const response = await authService.getCurrentUser();
      
      if (response?.data?.user) {
        dispatch({ 
          type: AUTH_ACTIONS.AUTH_SUCCESS, 
          payload: response.data.user 
        });
        return response.data.user;
      } else {
        dispatch({ type: AUTH_ACTIONS.AUTH_LOGOUT });
        return null;
      }
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.AUTH_LOGOUT });
      return null;
    }
  }, []);
  
  /**
   * Reset error state
   */
  const resetError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.AUTH_RESET_ERROR });
  }, []);
  
  /**
   * Update user data
   * @param {Object} userData - Updated user data
   */
  const updateUser = useCallback((userData) => {
    dispatch({ 
      type: AUTH_ACTIONS.AUTH_UPDATE_USER, 
      payload: userData 
    });
  }, []);
  
  /**
   * Complete user onboarding
   * @param {Object} userData - User profile data
   * @returns {Promise<Object>} Updated user data
   */
  const completeOnboarding = useCallback(async (userData) => {
    try {
      const response = await authService.completeOnboarding(userData);
      
      if (!response || !response.data || !response.data.user) {
        throw new Error('Invalid response from server');
      }
      
      dispatch({ 
        type: AUTH_ACTIONS.AUTH_UPDATE_USER, 
        payload: response.data.user 
      });
      
      return response.data.user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          'Failed to complete onboarding. Please try again.';
      
      showToast.error(errorMessage);
      throw error;
    }
  }, []);
  
  // Context value
  const value = {
    ...state,
    adminLogin,
    loginWithSpotify,
    register,
    logout,
    checkAuth,
    resetError,
    updateUser,
    completeOnboarding
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;