// File: /frontend/src/features/user/components/ProfileNotFound.jsx
// Not found state component for user profile

import { Link } from 'react-router-dom';
import { FaExclamationCircle } from 'react-icons/fa';

const ProfileNotFound = () => {
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
};

export default ProfileNotFound;