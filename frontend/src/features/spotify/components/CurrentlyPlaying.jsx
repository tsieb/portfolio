// File: /frontend/src/features/spotify/components/CurrentlyPlaying.jsx
// Enhanced currently playing component with animations and auto-update

import { useEffect, useState, useRef } from 'react';
import { useSpotify } from '../../../hooks/useSpotify';
import { FaSpotify, FaMusic, FaPlay, FaPause, FaVolumeUp } from 'react-icons/fa';
import './CurrentlyPlaying.scss';

/**
 * Enhanced component to display the currently playing Spotify track
 * with animations and more frequent updates
 */
const CurrentlyPlaying = () => {
  const { 
    currentTrack, 
    isPlaying, 
    isLoading, 
    error, 
    fetchCurrentTrack 
  } = useSpotify();
  
  // Track the previous track to animate changes
  const [prevTrack, setPrevTrack] = useState(null);
  const [isChanging, setIsChanging] = useState(false);
  const [updateTime, setUpdateTime] = useState(new Date());
  const animationTimeoutRef = useRef(null);
  
  useEffect(() => {
    // Initial fetch of currently playing track
    fetchCurrentTrack();
    
    // Poll for currently playing track more frequently (every 5 seconds)
    const interval = setInterval(() => {
      fetchCurrentTrack();
    }, 5000);
    
    return () => {
      clearInterval(interval);
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [fetchCurrentTrack]);
  
  // Handle track change animations
  useEffect(() => {
    if (currentTrack && (!prevTrack || prevTrack.trackId !== currentTrack.trackId)) {
      // Only animate if it's not the first load
      if (prevTrack) {
        setIsChanging(true);
        setUpdateTime(new Date());
        
        // Reset animation state after animation completes
        animationTimeoutRef.current = setTimeout(() => {
          setIsChanging(false);
        }, 800); // Match this with CSS animation duration
      }
      
      // Update previous track
      setPrevTrack(currentTrack);
    }
  }, [currentTrack, prevTrack]);
  
  // Format relative time for update display
  const getUpdateTimeText = () => {
    const seconds = Math.floor((new Date() - updateTime) / 1000);
    if (seconds < 60) {
      return `${seconds}s ago`;
    } else {
      return `${Math.floor(seconds / 60)}m ${seconds % 60}s ago`;
    }
  };
  
  if (isLoading && !currentTrack) {
    return (
      <div className="currently-playing">
        <div className="currently-playing__loading">
          <div className="spinner"></div>
          <span>Loading currently playing...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="currently-playing">
        <div className="currently-playing__error">
          <FaMusic size={24} />
          <p>Unable to fetch currently playing track.</p>
        </div>
      </div>
    );
  }
  
  if (!isPlaying || !currentTrack) {
    return (
      <div className="currently-playing currently-playing--not-playing">
        <div className="currently-playing__content">
          <div className="currently-playing__icon">
            <FaSpotify size={32} />
          </div>
          <div className="currently-playing__info">
            <div className="currently-playing__status">
              <FaPause size={14} className="currently-playing__status-icon" />
              Not playing right now
            </div>
            <p className="currently-playing__description">
              Check back later to see what I'm listening to.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`currently-playing ${isChanging ? 'is-changing' : ''}`}>
      <div className="currently-playing__header">
        <div className="currently-playing__status">
          <FaPlay size={14} className="currently-playing__status-icon" />
          <span>Currently playing on Spotify</span>
          <span className="currently-playing__update-time">{getUpdateTimeText()}</span>
        </div>
        <FaSpotify size={24} className="currently-playing__spotify-icon" />
      </div>
      
      <div className="currently-playing__content">
        {currentTrack.albumImageUrl ? (
          <div className="currently-playing__artwork">
            <img 
              src={currentTrack.albumImageUrl} 
              alt={`${currentTrack.albumName} album cover`} 
              className="currently-playing__image"
            />
            <div className="currently-playing__artwork-overlay">
              <div className="currently-playing__eq-animation">
                <span></span><span></span><span></span><span></span>
              </div>
            </div>
          </div>
        ) : (
          <div className="currently-playing__artwork currently-playing__artwork--placeholder">
            <FaMusic size={32} />
            <div className="currently-playing__artwork-overlay">
              <div className="currently-playing__eq-animation">
                <span></span><span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}
        
        <div className="currently-playing__info">
          <h3 className="currently-playing__track">
            {currentTrack.trackName}
          </h3>
          <p className="currently-playing__artist">
            {currentTrack.artistName}
          </p>
          <p className="currently-playing__album">
            {currentTrack.albumName}
          </p>
          
          <div className="currently-playing__meta">
            <div className="currently-playing__volume">
              <FaVolumeUp className="currently-playing__volume-icon" />
              <div className="currently-playing__volume-bar">
                <div className="currently-playing__volume-level"></div>
              </div>
            </div>
            
            {currentTrack.trackUrl && (
              <a 
                href={currentTrack.trackUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="currently-playing__link"
              >
                Listen on Spotify
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentlyPlaying;