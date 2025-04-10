// File: /frontend/src/features/user/components/ProfileRestricted.jsx
// Restricted access component for user profile

import { Link } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';

const ProfileRestricted = () => {
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
};

export default ProfileRestricted;