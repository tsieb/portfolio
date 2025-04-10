// File: /frontend/src/features/user/components/ProfileHeader.jsx
// Profile header component for user profile

import { FaUser, FaMusic, FaLock, FaGlobe } from 'react-icons/fa';

const ProfileHeader = ({ userProfile }) => {
  return (
    <div className="user-profile__header">
      <div className="container">
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
                <span className="badge badge--warning ml-sm">
                  <FaLock className="badge__icon" />
                  Private
                </span>
              )}
              {userProfile.isPublic && (
                <span className="badge badge--info ml-sm">
                  <FaGlobe className="badge__icon" />
                  Public
                </span>
              )}
            </h1>
            
            <div className="user-profile__spotify">
              <FaMusic className="user-profile__spotify-icon" />
              <span>Connected to Music Service</span>
            </div>
            
            {userProfile.bio && (
              <p className="user-profile__bio">{userProfile.bio}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;