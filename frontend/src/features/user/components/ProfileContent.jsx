// File: /frontend/src/features/user/components/ProfileContent.jsx
// Profile content component for user profile

import CurrentlyPlaying from '../../spotify/components/CurrentlyPlaying';
import RecentlyPlayed from '../../spotify/components/RecentlyPlayed';
import SpotifyStats from '../../spotify/components/SpotifyStats';

const ProfileContent = ({ userId }) => {
  return (
    <div className="user-profile__content">
      <section className="user-profile__section">
        <h2 className="section-title">Now Playing</h2>
        <CurrentlyPlaying userId={userId} />
      </section>
      
      <section className="user-profile__section mt-xl">
        <h2 className="section-title">Recent Tracks</h2>
        <RecentlyPlayed userId={userId} />
      </section>
      
      <section className="user-profile__section mt-xl">
        <h2 className="section-title">Listening Stats</h2>
        <SpotifyStats userId={userId} />
      </section>
    </div>
  );
};

export default ProfileContent;