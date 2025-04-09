// File: /frontend/src/context/SpotifyContext.jsx
// Updated Spotify context with more frequent polling and improved state management

import { createContext, useReducer, useEffect, useCallback, useRef } from 'react';
import spotifyService from '../services/spotify';

// Initial state
const initialState = {
  currentTrack: null,
  prevTrack: null,
  isPlaying: false,
  recentlyPlayed: [],
  stats: null,
  isLoading: true,
  error: null,
  lastUpdated: null
};

// Action types
const SPOTIFY_LOADING = 'SPOTIFY_LOADING';
const SPOTIFY_ERROR = 'SPOTIFY_ERROR';
const SET_CURRENT_TRACK = 'SET_CURRENT_TRACK';
const SET_RECENTLY_PLAYED = 'SET_RECENTLY_PLAYED';
const SET_STATS = 'SET_STATS';
const RESET_ERROR = 'RESET_ERROR';

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
  const fetchCurrentTrack = useCallback(async (silent = false) => {
    if (!silent) {
      dispatch({ type: SPOTIFY_LOADING });
    }
    
    try {
      const data = await spotifyService.getCurrentlyPlaying();
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
  }, []);
  
  // Fetch recently played tracks
  const fetchRecentlyPlayed = useCallback(async (limit = 10, skip = 0) => {
    dispatch({ type: SPOTIFY_LOADING });
    
    try {
      const data = await spotifyService.getRecentlyPlayed(limit, skip);
      dispatch({ type: SET_RECENTLY_PLAYED, payload: data.tracks });
      return data.tracks;
    } catch (error) {
      dispatch({ 
        type: SPOTIFY_ERROR, 
        payload: error.response?.data?.message || 'Failed to fetch recently played tracks' 
      });
      return [];
    }
  }, []);
  
  // Fetch listening statistics
  const fetchStats = useCallback(async () => {
    dispatch({ type: SPOTIFY_LOADING });
    
    try {
      const data = await spotifyService.getStats();
      dispatch({ type: SET_STATS, payload: data });
      return data;
    } catch (error) {
      dispatch({ 
        type: SPOTIFY_ERROR, 
        payload: error.response?.data?.message || 'Failed to fetch statistics' 
      });
      return null;
    }
  }, []);
  
  // Reset error state
  const resetError = useCallback(() => {
    dispatch({ type: RESET_ERROR });
  }, []);
  
  // Start polling for current track
  const startPolling = useCallback(() => {
    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    
    // Poll immediately
    fetchCurrentTrack();
    
    // Then set up the interval (every 5 seconds)
    pollingIntervalRef.current = setInterval(() => {
      // Use silent mode to avoid loading state flicker
      fetchCurrentTrack(true);
    }, 5000);
  }, [fetchCurrentTrack]);
  
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
  
  // Also fetch recently played on initial load
  useEffect(() => {
    fetchRecentlyPlayed(5);
  }, [fetchRecentlyPlayed]);
  
  // Context value
  const value = {
    ...state,
    fetchCurrentTrack,
    fetchRecentlyPlayed,
    fetchStats,
    resetError,
    startPolling,
    stopPolling
  };
  
  return (
    <SpotifyContext.Provider value={value}>
      {children}
    </SpotifyContext.Provider>
  );
};