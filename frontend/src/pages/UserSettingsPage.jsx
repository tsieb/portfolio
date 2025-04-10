// File: /frontend/src/pages/UserSettingsPage.jsx
// User settings page to manage profile and privacy settings

import { useUserSettings } from '../features/user/hooks/useUserSettings';
import ProfileForm from '../features/user/components/ProfileForm';
import PrivacySettings from '../features/user/components/PrivacySettings';
import SpotifyConnection from '../features/user/components/SpotifyConnection';

const UserSettingsPage = () => {
  const {
    user,
    loading,
    formData,
    handleChange,
    handleSubmit
  } = useUserSettings();
  
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
        <ProfileForm 
          formData={formData}
          loading={loading}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
        
        <PrivacySettings 
          formData={formData}
          handleChange={handleChange}
        />
        
        <SpotifyConnection user={user} />
      </div>
    </div>
  );
};

export default UserSettingsPage;