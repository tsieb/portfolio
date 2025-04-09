// File: /frontend/src/features/spotify/components/CurrentlyPlaying.jsx
// Currently playing component with user-specific data

import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSpotify } from '../hooks/useSpotify';
import { FaSpotify, FaMusic, FaPlay, FaPause, FaExternalLinkAlt } from 'react-icons/fa';
import '../../../assets/styles/features/spotify/components/CurrentlyPlaying.scss';

const CurrentlyPlaying = ({ variant = 'default', userId = null }) => {
  const { 
    currentTrack, 
    isPlaying, 
    isLoading, 
    error, 
    fetchCurrentTrack,
    startPolling,
    stopPolling,
    setUserId
  } = useSpotify();
  
  const [isChanging, setIsChanging] = useState(false);
  const [prevTrack, setPrevTrack] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const animationTimeoutRef = useRef(null);
  const progressIntervalRef = useRef(null);
  
  // Track initial load animation
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Make component visible with animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // If a user ID is provided, set it in the context
    if (userId) {
      setUserId(userId);
    }
    
    // Start polling for the specific user
    startPolling(userId);
    
    return () => {
      stopPolling();
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [userId, startPolling, stopPolling, setUserId]);
  
  // Handle track change animations
  useEffect(() => {
    if (currentTrack && (!prevTrack || prevTrack.trackId !== currentTrack.trackId)) {
      // Only animate if it's not the first load
      if (prevTrack) {
        setIsChanging(true);
        setElapsedTime(0);
        
        // Reset animation state after animation completes
        animationTimeoutRef.current = setTimeout(() => {
          setIsChanging(false);
        }, 800);
      }
      
      // Update previous track
      setPrevTrack(currentTrack);
    }
  }, [currentTrack, prevTrack]);
  
  // Track playback progress
  useEffect(() => {
    if (isPlaying && currentTrack) {
      setElapsedTime(0);
      
      // Clear existing interval
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      
      // Start new interval to track elapsed time
      progressIntervalRef.current = setInterval(() => {
        setElapsedTime(prev => {
          if (prev >= currentTrack.duration) {
            clearInterval(progressIntervalRef.current);
            return currentTrack.duration;
          }
          return prev + 1000;
        });
      }, 1000);
    } else if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, currentTrack]);
  
  // Calculate progress percentage
  const getProgressPercentage = () => {
    if (!currentTrack || !isPlaying) return 0;
    return Math.min(100, (elapsedTime / currentTrack.duration) * 100);
  };
  
  // Format time display
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Mini player version
  if (variant === 'mini') {
    return (
      <div className={`current-track-mini ${isPlaying ? 'is-playing' : ''} ${isVisible ? 'is-visible' : ''}`}>
        {isPlaying && currentTrack ? (
          <>
            <div className="current-track-mini__artwork">
              {currentTrack.albumImageUrl ? (
                <img 
                  src={currentTrack.albumImageUrl} 
                  alt={`${currentTrack.albumName} album cover`} 
                  className="current-track-mini__image"
                />
              ) : (
                <div className="current-track-mini__placeholder">
                  <FaMusic />
                </div>
              )}
              <div className="current-track-mini__overlay">
                <div className="current-track-mini__visualizer">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
            <div className="current-track-mini__info">
              <div className="current-track-mini__name">{currentTrack.trackName}</div>
              <div className="current-track-mini__artist">{currentTrack.artistName}</div>
            </div>
            <div className="current-track-mini__controls">
              {currentTrack.trackUrl && (
                <a 
                  href={currentTrack.trackUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="current-track-mini__link"
                >
                  <FaSpotify />
                </a>
              )}
            </div>
          </>
        ) : (
          <div className="current-track-mini__not-playing">
            <FaPause className="current-track-mini__icon" />
            <span>Not playing</span>
          </div>
        )}
      </div>
    );
  }
  
  // Full-featured standard version
  if (isLoading && !currentTrack) {
    return (
      <div className={`currently-playing ${isVisible ? 'is-visible' : ''}`}>
        <div className="currently-playing__loading">
          <div className="spinner"></div>
          <span>Loading currently playing...</span>
        </div>
      </div>
    );
  }
  
  // Render the default view
  return (
    <div className={`currently-playing ${isChanging ? 'is-changing' : ''} ${isVisible ? 'is-visible' : ''}`}>
      <div className="currently-playing__header">
        <div className="currently-playing__status">
          {isPlaying ? (
            <>
              <FaPlay className="currently-playing__status-icon" />
              <span>Currently playing on Spotify</span>
            </>
          ) : (
            <>
              <FaPause className="currently-playing__status-icon" />
              <span>Not playing right now</span>
            </>
          )}
        </div>
        <FaSpotify className="currently-playing__spotify-icon" />
      </div>
      
      <div className="currently-playing__content">
        {isPlaying && currentTrack ? (
          <>
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
                <FaMusic />
              </div>
            )}
            
            <div className="currently-playing__info">
              <h3 className="currently-playing__track">{currentTrack.trackName}</h3>
              <p className="currently-playing__artist">{currentTrack.artistName}</p>
              <p className="currently-playing__album">{currentTrack.albumName}</p>
              
              <div className="currently-playing__meta">
                <div className="currently-playing__progress">
                  <div className="currently-playing__progress-bar">
                    <div 
                      className="currently-playing__progress-fill"
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
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
          </>
        ) : (
          <div className="currently-playing__not-playing">
            <div className="currently-playing__icon">
              <FaSpotify />
            </div>
            <div className="currently-playing__info">
              <div className="currently-playing__status">
                <FaPause className="currently-playing__status-icon" />
                Not playing right now
              </div>
              <p className="currently-playing__description">
                Check back later to see what's playing.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

CurrentlyPlaying.propTypes = {
  variant: PropTypes.oneOf(['default', 'mini']),
  userId: PropTypes.string
};

export default CurrentlyPlaying;