// File: /frontend/src/components/admin/AdminHeader.jsx
// Admin header component with user info and logout button

import PropTypes from 'prop-types';
import { FaBars, FaSignOutAlt, FaUserShield } from 'react-icons/fa';

/**
 * Admin header component with user info and logout button
 * @param {Object} props - Component props
 * @param {Object} props.user - Current user object
 * @param {Function} props.onLogout - Logout handler function
 * @param {Function} props.onMenuClick - Menu toggle handler function
 */
const AdminHeader = ({ user, onLogout, onMenuClick }) => {
  const getInitials = (name) => {
    if (!name) return 'A';
    
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };
  
  return (
    <header className="header header--admin">
      <div className="header__inner">
        <div className="header__left">
          <button 
            className="header__toggle"
            onClick={onMenuClick}
            aria-label="Toggle sidebar"
          >
            <FaBars size={18} />
          </button>
          <h1 className="header__logo-text">Music Activity Admin</h1>
        </div>
        
        <div className="header__right">
          {user && (
            <div className="header__user">
              <div className="header__user-avatar">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.firstName || user.email} 
                    className="header__user-avatar-img" 
                  />
                ) : (
                  <span>{getInitials(user.firstName)}</span>
                )}
              </div>
              <div className="header__user-name">
                <span>
                  {user.firstName || user.email}
                </span>
                <span className="badge badge--primary">
                  <FaUserShield className="badge__icon" />
                  Administrator
                </span>
              </div>
            </div>
          )}
          
          <button 
            className="btn btn-outline"
            onClick={onLogout}
            aria-label="Logout"
          >
            <FaSignOutAlt className="mr-xs" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

AdminHeader.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func.isRequired,
  onMenuClick: PropTypes.func.isRequired
};

export default AdminHeader;