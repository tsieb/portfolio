// File: /frontend/src/features/user/components/ProfileHeader.jsx
// Profile header component for user profile

import { FaUser, FaMusic } from 'react-icons/fa';

const ProfileHeader = ({ userProfile }) => {
  return (
    <div className="user-profile__header">
      <div className="user-profile__info">
        <div className="user-profile__avatar">
          {userProfile.avatar ? (
            <img 
              src={userProfile.avatar} 
              alt={userProfile.displayName || userProfile.username} 
              className="user-profile__avatar-img" 
            />
          ) : (
            <FaUser className="user-profile__avatar-icon" />
          )}
        </div>
        
        <div className="user-profile__meta">
          <h1 className="user-profile__name">
            {userProfile.displayName || userProfile.username}
            {!userProfile.isPublic && (
              <span className="user-profile__badge user-profile__badge--private">
                Private
              </span>
            )}
            {userProfile.isPublic && (
              <span className="user-profile__badge user-profile__badge--public">
                Public
              </span>
            )}
          </h1>
          
          <div className="user-profile__spotify">
            <FaMusic className="user-profile__spotify-icon" />
            <span>Connected to Spotify</span>
          </div>
          
          {userProfile.bio && (
            <p className="user-profile__bio">{userProfile.bio}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;