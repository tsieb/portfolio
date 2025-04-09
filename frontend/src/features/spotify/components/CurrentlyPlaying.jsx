// File: /frontend/src/features/spotify/components/CurrentlyPlaying.jsx
// Currently playing component to display current Spotify track

import { useEffect } from 'react';
import { useSpotify } from '../../../hooks/useSpotify';
import { FaSpotify, FaMusic, FaPlay, FaPause } from 'react-icons/fa';
import './CurrentlyPlaying.scss';

/**
 * Component to display the currently playing Spotify track
 */
const CurrentlyPlaying = () => {
  const { 
    currentTrack, 
    isPlaying, 
    isLoading, 
    error, 
    fetchCurrentTrack 
  } = useSpotify();
  
  useEffect(() => {
    // Initial fetch of currently playing track
    fetchCurrentTrack();
    
    // Poll for currently playing track every 30 seconds
    const interval = setInterval(() => {
      fetchCurrentTrack();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchCurrentTrack]);
  
  if (isLoading) {
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
    <div className="currently-playing">
      <div className="currently-playing__header">
        <div className="currently-playing__status">
          <FaPlay size={14} className="currently-playing__status-icon" />
          Currently playing on Spotify
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
          </div>
        ) : (
          <div className="currently-playing__artwork currently-playing__artwork--placeholder">
            <FaMusic size={32} />
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
  );
};

export default CurrentlyPlaying;