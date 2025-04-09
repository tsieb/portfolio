// File: /frontend/src/features/spotify/components/CurrentlyPlaying.jsx
// Enhanced currently playing component with immersive design and variants

import { useEffect, useState, useRef } from 'react';
import { useSpotify } from '../hooks/useSpotify';
import { FaSpotify, FaMusic, FaPlay, FaPause, FaVolumeUp, FaExternalLinkAlt } from 'react-icons/fa';

const CurrentlyPlaying = ({ variant = 'default' }) => {
  const { 
    currentTrack, 
    isPlaying, 
    isLoading, 
    error, 
    fetchCurrentTrack 
  } = useSpotify();
  
  const [isChanging, setIsChanging] = useState(false);
  const [prevTrack, setPrevTrack] = useState(null);
  const [updateTime, setUpdateTime] = useState(new Date());
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
    // Initial fetch of currently playing track
    fetchCurrentTrack();
    
    // Poll for currently playing track
    const interval = setInterval(() => {
      fetchCurrentTrack();
    }, 5000);
    
    return () => {
      clearInterval(interval);
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
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
  
  if (variant === 'mini') {
    // Mini player version
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
  
  if (variant === 'hero') {
    // Hero fullscreen version
    if (isLoading && !currentTrack) {
      return (
        <div className={`current-track-hero ${isVisible ? 'is-visible' : ''}`}>
          <div className="current-track-hero__loading">
            <div className="spinner"></div>
            <span>Connecting to Spotify...</span>
          </div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className={`current-track-hero ${isVisible ? 'is-visible' : ''}`}>
          <div className="current-track-hero__error">
            <FaSpotify className="current-track-hero__error-icon" />
            <p>Unable to connect to Spotify</p>
          </div>
        </div>
      );
    }
    
    if (!isPlaying || !currentTrack) {
      return (
        <div className={`current-track-hero current-track-hero--not-playing ${isVisible ? 'is-visible' : ''}`}>
          <div className="current-track-hero__status">
            <FaPause className="current-track-hero__status-icon" />
            <span>Not playing right now</span>
          </div>
          <div className="current-track-hero__message">
            <p>Music is on pause. Check back soon to see what's playing.</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className={`current-track-hero ${isChanging ? 'is-changing' : ''} ${isVisible ? 'is-visible' : ''}`}>
        <div className="current-track-hero__status">
          <FaPlay className="current-track-hero__status-icon" />
          <span>Now Playing</span>
          <FaSpotify className="current-track-hero__spotify-icon" />
        </div>
        
        <div className="current-track-hero__content">
          <div className="current-track-hero__artwork">
            {currentTrack.albumImageUrl && (
              <img 
                src={currentTrack.albumImageUrl} 
                alt={`${currentTrack.albumName} album cover`} 
                className="current-track-hero__image"
              />
            )}
          </div>
          
          <div className="current-track-hero__info">
            <h1 className="current-track-hero__track">{currentTrack.trackName}</h1>
            <h2 className="current-track-hero__artist">{currentTrack.artistName}</h2>
            <p className="current-track-hero__album">{currentTrack.albumName}</p>
            
            <div className="current-track-hero__progress">
              <div className="current-track-hero__progress-bar">
                <div 
                  className="current-track-hero__progress-fill"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              <div className="current-track-hero__times">
                <span>{formatTime(elapsedTime)}</span>
                <span>{formatTime(currentTrack.duration)}</span>
              </div>
            </div>
            
            {currentTrack.trackUrl && (
              <a 
                href={currentTrack.trackUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="current-track-hero__link"
              >
                <FaExternalLinkAlt className="current-track-hero__link-icon" />
                <span>Open in Spotify</span>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Default version (unchanged from original component)
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
  
  // Render the rest of the default component (similar to original implementation)
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
                Check back later to see what I'm listening to.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentlyPlaying;