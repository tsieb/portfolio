// File: /frontend/src/context/AuthContext.jsx
// Authentication context for managing auth state

import { createContext, useReducer, useCallback } from 'react';
import authService from '../services/auth';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
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
        user: action.payload,
        error: null
      };
    case AUTH_FAIL:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload
      };
    case AUTH_LOGOUT:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
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
  
  // Login user
  const login = useCallback(async (email, password) => {
    dispatch({ type: AUTH_START });
    
    try {
      const data = await authService.login(email, password);
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
  
  // Context value
  const value = {
    ...state,
    login,
    logout,
    checkAuth,
    resetError
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};