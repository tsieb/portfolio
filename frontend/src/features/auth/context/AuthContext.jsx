// File: /frontend/src/features/auth/context/AuthContext.jsx
// Authentication context with Spotify OAuth support

import { createContext, useReducer, useCallback, useEffect } from 'react';
import authService from '../services/authApi';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  error: null
};

// Action types
const AUTH_START = 'AUTH_START';
const AUTH_SUCCESS = 'AUTH_SUCCESS';
const AUTH_FAIL = 'AUTH_FAIL';
const AUTH_LOGOUT = 'AUTH_LOGOUT';
const AUTH_RESET_ERROR = 'AUTH_RESET_ERROR';

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case AUTH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        isAdmin: action.payload?.role === 'admin',
        user: action.payload,
        error: null
      };
    case AUTH_FAIL:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        isAdmin: false,
        user: null,
        error: action.payload
      };
    case AUTH_LOGOUT:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        isAdmin: false,
        user: null
      };
    case AUTH_RESET_ERROR:
      return {
        ...state,
        error: null
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
  
  // Admin login with email and password
  const adminLogin = useCallback(async (email, password) => {
    dispatch({ type: AUTH_START });
    
    try {
      const data = await authService.adminLogin(email, password);
      dispatch({ type: AUTH_SUCCESS, payload: data.user });
      return data.user;
    } catch (error) {
      dispatch({ 
        type: AUTH_FAIL, 
        payload: error.response?.data?.message || 'Authentication failed' 
      });
      throw error;
    }
  }, []);
  
  // Login with Spotify OAuth
  const loginWithSpotify = useCallback(async (tokenData) => {
    dispatch({ type: AUTH_START });
    
    try {
      const data = await authService.loginWithSpotify(tokenData);
      dispatch({ type: AUTH_SUCCESS, payload: data.user });
      return data.user;
    } catch (error) {
      dispatch({ 
        type: AUTH_FAIL, 
        payload: error.response?.data?.message || 'Spotify authentication failed' 
      });
      throw error;
    }
  }, []);
  
  // Logout user
  const logout = useCallback(async () => {
    dispatch({ type: AUTH_START });
    
    try {
      await authService.logout();
      dispatch({ type: AUTH_LOGOUT });
    } catch (error) {
      dispatch({ 
        type: AUTH_FAIL, 
        payload: error.response?.data?.message || 'Logout failed' 
      });
    }
  }, []);
  
  // Check if user is authenticated
  const checkAuth = useCallback(async () => {
    dispatch({ type: AUTH_START });
    
    try {
      const data = await authService.getCurrentUser();
      if (data?.user) {
        dispatch({ type: AUTH_SUCCESS, payload: data.user });
      } else {
        dispatch({ type: AUTH_LOGOUT });
      }
    } catch (error) {
      dispatch({ type: AUTH_LOGOUT });
    }
  }, []);
  
  // Reset error state
  const resetError = useCallback(() => {
    dispatch({ type: AUTH_RESET_ERROR });
  }, []);
  
  // Update user data in state after settings change
  const updateUser = useCallback((userData) => {
    dispatch({ type: AUTH_SUCCESS, payload: userData });
  }, []);
  
  // Context value
  const value = {
    ...state,
    adminLogin,
    loginWithSpotify,
    logout,
    checkAuth,
    resetError,
    updateUser
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};