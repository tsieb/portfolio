// File: /frontend/src/context/SpotifyContext.jsx
// Spotify context for managing Spotify data

import { createContext, useReducer, useEffect, useCallback } from 'react';
import spotifyService from '../services/spotify';

// Initial state
const initialState = {
  currentTrack: null,
  isPlaying: false,
  recentlyPlayed: [],
  stats: null,
  isLoading: true,
  error: null
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
    case SET_CURRENT_TRACK:
      return {
        ...state,
        isLoading: false,
        currentTrack: action.payload?.track || null,
        isPlaying: action.payload?.isPlaying || false,
        error: null
      };
    case SET_RECENTLY_PLAYED:
      return {
        ...state,
        isLoading: false,
        recentlyPlayed: action.payload,
        error: null
      };
    case SET_STATS:
      return {
        ...state,
        isLoading: false,
        stats: action.payload,
        error: null
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
  
  // Fetch current track
  const fetchCurrentTrack = useCallback(async () => {
    try {
      const data = await spotifyService.getCurrentlyPlaying();
      dispatch({ type: SET_CURRENT_TRACK, payload: data });
      return data;
    } catch (error) {
      dispatch({ 
        type: SPOTIFY_ERROR, 
        payload: error.response?.data?.message || 'Failed to fetch current track' 
      });
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
    }
  }, []);
  
  // Reset error state
  const resetError = useCallback(() => {
    dispatch({ type: RESET_ERROR });
  }, []);
  
  // Fetch current track on initial load and set up polling
  useEffect(() => {
    // Initial fetch
    fetchCurrentTrack();
    
    // Set up polling for current track (every 30 seconds)
    const interval = setInterval(() => {
      fetchCurrentTrack();
    }, 30000);
    
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [fetchCurrentTrack]);
  
  // Context value
  const value = {
    ...state,
    fetchCurrentTrack,
    fetchRecentlyPlayed,
    fetchStats,
    resetError
  };
  
  return (
    <SpotifyContext.Provider value={value}>
      {children}
    </SpotifyContext.Provider>
  );
};