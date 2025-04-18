// File: /frontend/src/features/spotify/components/RecentlyPlayed.jsx
// Enhanced recently played component with animations - Fixed infinite update loop

import { useEffect, useState, useCallback } from 'react';
import { useSpotify } from '../hooks/useSpotify';
import { FaMusic, FaHistory, FaClock } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import '../../../assets/styles/features/spotify/components/RecentlyPlayed.scss';

/**
 * Enhanced component to display recently played Spotify tracks
 * with animations and visual improvements
 */
const RecentlyPlayed = () => {
  const { 
    recentlyPlayed, 
    isLoading, 
    error, 
    fetchRecentlyPlayed 
  } = useSpotify();
  
  const [newTracks, setNewTracks] = useState([]);
  const [prevTrackIds, setPrevTrackIds] = useState([]);
  
  // Use useCallback to prevent the function from being recreated on every render
  const fetchTracks = useCallback(() => {
    fetchRecentlyPlayed(5);
  }, [fetchRecentlyPlayed]);
  
  // Fetch tracks on initial mount only
  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);
  
  // Track changes for animations - separate from the fetch effect
  useEffect(() => {
    if (recentlyPlayed && recentlyPlayed.length > 0) {
      const currentIds = recentlyPlayed.map(track => track._id);
      
      // Find tracks that weren't in the previous list
      if (prevTrackIds.length > 0) {
        const newItems = recentlyPlayed.filter(track => 
          !prevTrackIds.includes(track._id)
        );
        
        if (newItems.length > 0) {
          setNewTracks(newItems.map(track => track._id));
          
          // Clear animation flags after animation completes
          const animationTimeout = setTimeout(() => {
            setNewTracks([]);
          }, 2000);
          
          // Clean up timeout to prevent memory leaks
          return () => clearTimeout(animationTimeout);
        }
      }
      
      // Only update previous track IDs if they've changed
      if (JSON.stringify(currentIds) !== JSON.stringify(prevTrackIds)) {
        setPrevTrackIds(currentIds);
      }
    }
  }, [recentlyPlayed, prevTrackIds]);
  
  if (isLoading && (!recentlyPlayed || recentlyPlayed.length === 0)) {
    return (
      <div className="recently-played">
        <div className="recently-played__header">
          <h2 className="recently-played__title">
            <FaHistory className="recently-played__icon" />
            Recently Played
          </h2>
        </div>
        <div className="recently-played__loading">
          <div className="spinner"></div>
          <span>Loading recently played tracks...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="recently-played">
        <div className="recently-played__header">
          <h2 className="recently-played__title">
            <FaHistory className="recently-played__icon" />
            Recently Played
          </h2>
        </div>
        <div className="recently-played__error">
          <FaMusic size={24} />
          <p>Unable to fetch recently played tracks.</p>
        </div>
      </div>
    );
  }
  
  if (!recentlyPlayed || recentlyPlayed.length === 0) {
    return (
      <div className="recently-played">
        <div className="recently-played__header">
          <h2 className="recently-played__title">
            <FaHistory className="recently-played__icon" />
            Recently Played
          </h2>
        </div>
        <div className="recently-played__empty">
          <FaMusic size={24} />
          <p>No recently played tracks found.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="recently-played">
      <div className="recently-played__header">
        <h2 className="recently-played__title">
          <FaHistory className="recently-played__icon" />
          Recently Played
        </h2>
        <span className="recently-played__count">
          {recentlyPlayed.length} tracks
        </span>
      </div>
      
      <ul className="recently-played__list">
        {recentlyPlayed.map((track) => (
          <li 
            key={`${track._id}`} 
            className={`recently-played__item ${
              newTracks.includes(track._id) ? 'recently-played__item--new' : ''
            }`}
          >
            {track.albumImageUrl ? (
              <img 
                src={track.albumImageUrl} 
                alt={`${track.albumName} album cover`} 
                className="recently-played__image"
                loading="lazy"
              />
            ) : (
              <div className="recently-played__image-placeholder">
                <FaMusic size={16} />
              </div>
            )}
            
            <div className="recently-played__info">
              <div className="recently-played__track">{track.trackName}</div>
              <div className="recently-played__artist">{track.artistName}</div>
            </div>
            
            <div className="recently-played__time">
              <FaClock className="recently-played__time-icon" />
              {formatDistanceToNow(new Date(track.playedAt), { addSuffix: true })}
            </div>
            
            {newTracks.includes(track._id) && (
              <div className="recently-played__new-badge">New</div>
            )}
          </li>
        ))}
      </ul>
      
      <div className="recently-played__footer">
        <button 
          className="recently-played__refresh" 
          onClick={fetchTracks}
          aria-label="Refresh recently played tracks"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default RecentlyPlayed;