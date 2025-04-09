// File: /frontend/src/pages/UserProfilePage.jsx
// User profile page showing a user's music activity

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaSpotify, FaUser, FaLock, FaExclamationCircle } from 'react-icons/fa';
import { useAuth } from '../features/auth/hooks/useAuth';
import userService from '../features/user/services/userApi';
import CurrentlyPlaying from '../features/spotify/components/CurrentlyPlaying';
import RecentlyPlayed from '../features/spotify/components/RecentlyPlayed';
import SpotifyStats from '../features/spotify/components/SpotifyStats';
import '../assets/styles/pages/UserProfilePage.scss';

const UserProfilePage = () => {
  const { username } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const data = await userService.getUserProfile(username);
        setUserProfile(data);
        
        // Check if current user is the profile owner
        if (isAuthenticated && currentUser) {
          setIsOwner(currentUser.username === username);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err.response?.data?.message || 'Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };
    
    if (username) {
      fetchUserProfile();
    }
  }, [username, isAuthenticated, currentUser]);
  
  if (loading) {
    return (
      <div className="user-profile">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="user-profile">
        <div className="user-profile__error">
          <FaExclamationCircle className="user-profile__error-icon" />
          <h2>Unable to load profile</h2>
          <p>{error}</p>
          <Link to="/" className="btn btn-primary">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }
  
  if (!userProfile) {
    return (
      <div className="user-profile">
        <div className="user-profile__error">
          <FaExclamationCircle className="user-profile__error-icon" />
          <h2>User not found</h2>
          <p>The user you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="btn btn-primary">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }
  
  // Check if profile is private and user doesn't have access
  if (!userProfile.isPublic && !isOwner && !userProfile.hasAccess) {
    return (
      <div className="user-profile">
        <div className="user-profile__restricted">
          <FaLock className="user-profile__restricted-icon" />
          <h2>Private Profile</h2>
          <p>This profile is private. Only the owner and authorized users can view it.</p>
          <Link to="/" className="btn btn-primary">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="user-profile">
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
              <FaSpotify className="user-profile__spotify-icon" />
              <span>Connected to Spotify</span>
            </div>
            
            {userProfile.bio && (
              <p className="user-profile__bio">{userProfile.bio}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="user-profile__content">
        <div className="user-profile__section">
          <h2 className="user-profile__section-title">Now Playing</h2>
          <CurrentlyPlaying userId={userProfile._id} />
        </div>
        
        <div className="user-profile__section">
          <h2 className="user-profile__section-title">Recent Tracks</h2>
          <RecentlyPlayed userId={userProfile._id} />
        </div>
        
        <div className="user-profile__section">
          <h2 className="user-profile__section-title">Listening Stats</h2>
          <SpotifyStats userId={userProfile._id} />
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;