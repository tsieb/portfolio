// File: /frontend/src/features/user/components/ProfileContent.jsx
// Profile content component for user profile

import CurrentlyPlaying from '../../spotify/components/CurrentlyPlaying';
import RecentlyPlayed from '../../spotify/components/RecentlyPlayed';
import SpotifyStats from '../../spotify/components/SpotifyStats';

const ProfileContent = ({ userId }) => {
  return (
    <div className="user-profile__content">
      <div className="user-profile__section">
        <h2 className="user-profile__section-title">Now Playing</h2>
        <CurrentlyPlaying userId={userId} />
      </div>
      
      <div className="user-profile__section">
        <h2 className="user-profile__section-title">Recent Tracks</h2>
        <RecentlyPlayed userId={userId} />
      </div>
      
      <div className="user-profile__section">
        <h2 className="user-profile__section-title">Listening Stats</h2>
        <SpotifyStats userId={userId} />
      </div>
    </div>
  );
};

export default ProfileContent;