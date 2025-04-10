// File: /frontend/src/features/user/components/ProfileForm.jsx
// Profile form component for user settings

import { FaUser, FaEdit, FaSave } from 'react-icons/fa';

const ProfileForm = ({ formData, loading, handleChange, handleSubmit }) => {
  return (
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
  );
};

export default ProfileForm;