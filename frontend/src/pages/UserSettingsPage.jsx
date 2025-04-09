// File: /frontend/src/pages/UserSettingsPage.jsx
// User settings page to manage profile and privacy settings

import { useState, useEffect } from 'react';
import { FaMusic, FaUser, FaLock, FaEdit, FaSave, FaGlobe, FaUserFriends } from 'react-icons/fa';
import { useAuth } from '../features/auth/hooks/useAuth';
import userService from '../features/user/services/userApi';
import { showToast } from '../config/toast';

const UserSettingsPage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    bio: '',
    isPublic: true,
    allowedViewers: []
  });
  
  // Load user data on component mount
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        username: user.username || '',
        bio: user.bio || '',
        isPublic: user.isPublic !== undefined ? user.isPublic : true,
        allowedViewers: user.allowedViewers || []
      });
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const updatedUser = await userService.updateUserProfile(formData);
      updateUser(updatedUser);
      showToast.success('Profile settings updated successfully');
    } catch (err) {
      showToast.error(err.message || 'Failed to update profile settings');
    } finally {
      setLoading(false);
    }
  };
  
  if (!user) {
    return (
      <div className="settings-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="settings-page">
      <div className="settings-page__header">
        <h1 className="settings-page__title">Profile Settings</h1>
        <p className="settings-page__subtitle">
          Manage your profile details and privacy settings
        </p>
      </div>
      
      <div className="settings-page__content">
        <div className="settings-card">
          <div className="settings-card__header">
            <FaUser className="settings-card__icon" />
            <h2 className="settings-card__title">Profile Information</h2>
          </div>
          
          <form className="settings-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="displayName" className="form-label">Display Name</label>
              <div className="form-input-group">
                <div className="form-input-icon">
                  <FaUser />
                </div>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  className="form-input form-input--with-icon"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="Your display name"
                />
              </div>
              <div className="form-help">This name will be visible to others</div>
            </div>
            
            <div className="form-group">
              <label htmlFor="username" className="form-label">URL Username</label>
              <div className="form-input-group">
                <div className="form-input-icon">
                  <FaEdit />
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-input form-input--with-icon"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="your-username"
                />
              </div>
              <div className="form-help">Used for your profile URL: music.example.com/{formData.username || 'username'}</div>
            </div>
            
            <div className="form-group">
              <label htmlFor="bio" className="form-label">Bio</label>
              <textarea
                id="bio"
                name="bio"
                className="form-input"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell others about yourself and your music taste"
                rows="4"
              ></textarea>
            </div>
            
            <div className="settings-card__divider"></div>
            
            <div className="settings-card__header">
              <FaLock className="settings-card__icon" />
              <h2 className="settings-card__title">Privacy Settings</h2>
            </div>
            
            <div className="form-group">
              <div className="form-checkbox">
                <input
                  type="checkbox"
                  id="isPublic"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                />
                <label htmlFor="isPublic">
                  <FaGlobe className="form-checkbox-icon" />
                  Public Profile
                </label>
              </div>
              <div className="form-help">Make your music activity visible to everyone</div>
            </div>
            
            {!formData.isPublic && (
              <div className="form-group">
                <label className="form-label">
                  <FaUserFriends className="form-checkbox-icon" />
                  Allowed Viewers
                </label>
                <div className="settings-viewers">
                  <p className="settings-viewers__empty">
                    You haven't added any allowed viewers yet.
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    disabled={loading}
                  >
                    Add Viewers
                  </button>
                </div>
              </div>
            )}
            
            <div className="settings-form__actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner spinner--sm mr-sm"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-sm" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        <div className="settings-card">
          <div className="settings-card__header">
            <FaMusic className="settings-card__icon" />
            <h2 className="settings-card__title">Spotify Connection</h2>
          </div>
          
          <div className="settings-card__content">
            {user.spotifyConnected ? (
              <div className="settings-spotify settings-spotify--connected">
                <div className="settings-spotify__status">
                  {/* <FaCheckCircle className="settings-spotify__status-icon" /> */}
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
      </div>
    </div>
  );
};

export default UserSettingsPage;