// File: /frontend/src/features/user/components/PrivacySettings.jsx
// Privacy settings component for user settings

import { FaLock, FaGlobe, FaUserFriends } from 'react-icons/fa';

const PrivacySettings = ({ formData, handleChange }) => {
  return (
    <div className="settings-card">
      <div className="settings-card__header">
        <FaLock className="settings-card__icon" />
        <h2 className="settings-card__title">Privacy Settings</h2>
      </div>
      
      <div className="settings-card__content">
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
              >
                Add Viewers
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivacySettings;