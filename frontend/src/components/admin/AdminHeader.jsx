// File: /frontend/src/components/admin/AdminHeader.jsx
// Admin header component

import PropTypes from 'prop-types';
import { FaBars, FaSignOutAlt } from 'react-icons/fa';

/**
 * Admin header component with user info and logout button
 * @param {Object} props - Component props
 * @param {Object} props.user - Current user object
 * @param {Function} props.onLogout - Logout handler function
 * @param {Function} props.onMenuClick - Menu toggle handler function
 */
const AdminHeader = ({ user, onLogout, onMenuClick }) => {
  const getInitials = (name) => {
    if (!name) return 'U';
    
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };
  
  return (
    <header className="admin-header">
      <div className="admin-header__left">
        <button 
          className="admin-header__toggle"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
        >
          <FaBars size={18} />
        </button>
        <h1 className="admin-header__title">Admin Dashboard</h1>
      </div>
      
      <div className="admin-header__actions">
        {user && (
          <div className="admin-header__user">
            <div className="admin-header__avatar">
              {getInitials(user.firstName)}
            </div>
            <span className="admin-header__username">
              {user.firstName || user.email}
            </span>
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
    </header>
  );
};

AdminHeader.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func.isRequired,
  onMenuClick: PropTypes.func.isRequired
};

export default AdminHeader;