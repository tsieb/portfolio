// File: /frontend/src/features/user/components/SpotifyConnection.jsx
// Spotify connection component for user settings

import { FaMusic } from 'react-icons/fa';

const SpotifyConnection = ({ user }) => {
  return (
    <div className="settings-card">
      <div className="settings-card__header">
        <FaMusic className="settings-card__icon" />
        <h2 className="settings-card__title">Spotify Connection</h2>
      </div>
      
      <div className="settings-card__content">
        {user.spotifyConnected ? (
          <div className="settings-spotify settings-spotify--connected">
            <div className="settings-spotify__status">
              <div className="settings-spotify__status-text">
                <h3>Connected to Spotify</h3>
                <p>Your music activity is being tracked</p>
              </div>
            </div>
            
            <button className="btn btn-outline btn-sm">
              Reconnect Spotify
            </button>
          </div>
        ) : (
          <div className="settings-spotify">
            <p className="settings-spotify__message">
              Connect your Spotify account to share your music activity
            </p>
            
            <a href="/api/auth/spotify" className="btn btn-spotify">
              <FaMusic className="btn-spotify__icon" />
              Connect with Spotify
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotifyConnection;