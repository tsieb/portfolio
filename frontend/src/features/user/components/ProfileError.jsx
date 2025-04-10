// File: /frontend/src/features/user/components/ProfileError.jsx
// Error state component for user profile

import { Link } from 'react-router-dom';
import { FaExclamationCircle } from 'react-icons/fa';

const ProfileError = ({ message }) => {
  return (
    <div className="user-profile">
      <div className="user-profile__error">
        <FaExclamationCircle className="user-profile__error-icon" />
        <h2>Unable to load profile</h2>
        <p>{message}</p>
        <Link to="/" className="btn btn-primary">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default ProfileError;