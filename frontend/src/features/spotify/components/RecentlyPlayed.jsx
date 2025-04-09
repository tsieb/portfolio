// File: /frontend/src/features/spotify/components/RecentlyPlayed.jsx
// Recently played component to display recent Spotify tracks

import { useEffect } from 'react';
import { useSpotify } from '../../../hooks/useSpotify';
import { FaMusic, FaHistory } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import './RecentlyPlayed.scss';

/**
 * Component to display recently played Spotify tracks
 */
const RecentlyPlayed = () => {
  const { 
    recentlyPlayed, 
    isLoading, 
    error, 
    fetchRecentlyPlayed 
  } = useSpotify();
  
  useEffect(() => {
    fetchRecentlyPlayed(5);
  }, [fetchRecentlyPlayed]);
  
  if (isLoading) {
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
      </div>
      
      <ul className="recently-played__list">
        {recentlyPlayed.map((track) => (
          <li key={`${track._id}`} className="recently-played__item">
            {track.albumImageUrl ? (
              <img 
                src={track.albumImageUrl} 
                alt={`${track.albumName} album cover`} 
                className="recently-played__image"
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
              {formatDistanceToNow(new Date(track.playedAt), { addSuffix: true })}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentlyPlayed;