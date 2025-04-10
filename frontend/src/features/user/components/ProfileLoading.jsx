// File: /frontend/src/features/user/components/ProfileLoading.jsx
// Loading state component for user profile

const ProfileLoading = () => {
    return (
      <div className="user-profile">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  };
  
  export default ProfileLoading;