// File: /frontend/src/hooks/useSpotify.js
// Custom hook for Spotify context

import { useContext } from 'react';
import { SpotifyContext } from '../context/SpotifyContext';

/**
 * Custom hook to access Spotify context
 * @returns {Object} Spotify context values and methods
 */
export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  
  return context;
};