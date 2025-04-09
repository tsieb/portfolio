// File: /frontend/src/features/spotify/context/SpotifyContext.jsx
// Spotify context with user-specific data

import { createContext, useReducer, useEffect, useCallback, useRef } from 'react';
import spotifyService from '../services/spotifyApi';

// Initial state
const initialState = {
  currentTrack: null,
  prevTrack: null,
  isPlaying: false,
  recentlyPlayed: [],
  stats: null,
  isLoading: true,
  error: null,
  lastUpdated: null,
  userId: null
};

// Action types
const SPOTIFY_LOADING = 'SPOTIFY_LOADING';
const SPOTIFY_ERROR = 'SPOTIFY_ERROR';
const SET_CURRENT_TRACK = 'SET_CURRENT_TRACK';
const SET_RECENTLY_PLAYED = 'SET_RECENTLY_PLAYED';
const SET_STATS = 'SET_STATS';
const RESET_ERROR = 'RESET_ERROR';
const SET_USER_ID = 'SET_USER_ID';

// Reducer function
const spotifyReducer = (state, action) => {
  switch (action.type) {
    case SPOTIFY_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case SPOTIFY_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case SET_CURRENT_TRACK: {
      const newTrack = action.payload?.track || null;
      const isNewTrack = newTrack && 
        (!state.currentTrack || state.currentTrack.trackId !== newTrack.trackId);
      
      return {
        ...state,
        isLoading: false,
        currentTrack: newTrack,
        prevTrack: isNewTrack ? state.currentTrack : state.prevTrack,
        isPlaying: action.payload?.isPlaying || false,
        error: null,
        lastUpdated: new Date()
      };
    }
    case SET_RECENTLY_PLAYED:
      return {
        ...state,
        isLoading: false,
        recentlyPlayed: action.payload,
        error: null,
        lastUpdated: new Date()
      };
    case SET_STATS:
      return {
        ...state,
        isLoading: false,
        stats: action.payload,
        error: null,
        lastUpdated: new Date()
      };
    case RESET_ERROR:
      return {
        ...state,
        error: null
      };
    case SET_USER_ID:
      return {
        ...state,
        userId: action.payload
      };
    default:
      return state;
  }
};

// Create context
export const SpotifyContext = createContext();

// Provider component
export const SpotifyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(spotifyReducer, initialState);
  const pollingIntervalRef = useRef(null);
  
  // Fetch current track with optional silent loading
  const fetchCurrentTrack = useCallback(async (silent = false, userId = null) => {
    if (!silent) {
      dispatch({ type: SPOTIFY_LOADING });
    }
    
    try {
      const data = await spotifyService.getCurrentlyPlaying(userId || state.userId);
      dispatch({ type: SET_CURRENT_TRACK, payload: data });
      return data;
    } catch (error) {
      // Only dispatch error if not silent
      if (!silent) {
        dispatch({ 
          type: SPOTIFY_ERROR, 
          payload: error.response?.data?.message || 'Failed to fetch current track' 
        });
      }
      return null;
    }
  }, [state.userId]);
  
  // Fetch recently played tracks
  const fetchRecentlyPlayed = useCallback(async (limit = 10, skip = 0, userId = null) => {
    dispatch({ type: SPOTIFY_LOADING });
    
    try {
      const data = await spotifyService.getRecentlyPlayed(limit, skip, userId || state.userId);
      dispatch({ type: SET_RECENTLY_PLAYED, payload: data.tracks });
      return data.tracks;
    } catch (error) {
      dispatch({ 
        type: SPOTIFY_ERROR, 
        payload: error.response?.data?.message || 'Failed to fetch recently played tracks' 
      });
      return [];
    }
  }, [state.userId]);
  
  // Fetch listening statistics
  const fetchStats = useCallback(async (userId = null) => {
    dispatch({ type: SPOTIFY_LOADING });
    
    try {
      const data = await spotifyService.getStats(userId || state.userId);
      dispatch({ type: SET_STATS, payload: data });
      return data;
    } catch (error) {
      dispatch({ 
        type: SPOTIFY_ERROR, 
        payload: error.response?.data?.message || 'Failed to fetch statistics' 
      });
      return null;
    }
  }, [state.userId]);
  
  // Set user ID for context
  const setUserId = useCallback((userId) => {
    dispatch({ type: SET_USER_ID, payload: userId });
  }, []);
  
  // Reset error state
  const resetError = useCallback(() => {
    dispatch({ type: RESET_ERROR });
  }, []);
  
  // Start polling for current track
  const startPolling = useCallback((userId = null) => {
    // Set user ID if provided
    if (userId) {
      setUserId(userId);
    }
    
    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    
    // Poll immediately
    fetchCurrentTrack(false, userId);
    
    // Then set up the interval (every 5 seconds)
    pollingIntervalRef.current = setInterval(() => {
      // Use silent mode to avoid loading state flicker
      fetchCurrentTrack(true, userId || state.userId);
    }, 5000);
  }, [fetchCurrentTrack, state.userId, setUserId]);
  
  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);
  
  // Fetch current track on initial load and set up polling
  useEffect(() => {
    startPolling();
    
    // Clean up interval on unmount
    return () => stopPolling();
  }, [startPolling, stopPolling]);
  
  // Context value
  const value = {
    ...state,
    fetchCurrentTrack,
    fetchRecentlyPlayed,
    fetchStats,
    resetError,
    startPolling,
    stopPolling,
    setUserId
  };
  
  return (
    <SpotifyContext.Provider value={value}>
      {children}
    </SpotifyContext.Provider>
  );
};