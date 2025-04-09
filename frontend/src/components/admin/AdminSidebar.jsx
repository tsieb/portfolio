// File: /frontend/src/components/admin/AdminSidebar.jsx
// Admin sidebar component

import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { FaTimes, FaHome, FaMusic, FaChartBar, FaCog } from 'react-icons/fa';

/**
 * Admin sidebar component with navigation links
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the sidebar is open (mobile only)
 * @param {Function} props.onClose - Close sidebar handler function
 */
const AdminSidebar = ({ isOpen, onClose }) => {
  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="admin-sidebar__header">
        <div className="admin-sidebar__logo">Portfolio Admin</div>
        <button 
          className="admin-sidebar__close"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <FaTimes size={18} />
        </button>
      </div>
      
      <nav className="admin-sidebar__nav">
        <div className="admin-sidebar__nav-group">
          <div className="admin-sidebar__nav-title">Dashboard</div>
          <NavLink 
            to="/admin" 
            end
            className={({ isActive }) => 
              isActive ? 'admin-sidebar__nav-item active' : 'admin-sidebar__nav-item'
            }
          >
            <FaHome className="admin-sidebar__nav-icon" />
            Overview
          </NavLink>
        </div>
        
        <div className="admin-sidebar__nav-group">
          <div className="admin-sidebar__nav-title">Spotify</div>
          <NavLink 
            to="/admin/tracks" 
            className={({ isActive }) => 
              isActive ? 'admin-sidebar__nav-item active' : 'admin-sidebar__nav-item'
            }
          >
            <FaMusic className="admin-sidebar__nav-icon" />
            Tracks History
          </NavLink>
          <NavLink 
            to="/admin/stats" 
            className={({ isActive }) => 
              isActive ? 'admin-sidebar__nav-item active' : 'admin-sidebar__nav-item'
            }
          >
            <FaChartBar className="admin-sidebar__nav-icon" />
            Analytics
          </NavLink>
        </div>
        
        <div className="admin-sidebar__nav-group">
          <div className="admin-sidebar__nav-title">System</div>
          <NavLink 
            to="/admin/settings" 
            className={({ isActive }) => 
              isActive ? 'admin-sidebar__nav-item active' : 'admin-sidebar__nav-item'
            }
          >
            <FaCog className="admin-sidebar__nav-icon" />
            Settings
          </NavLink>
        </div>
      </nav>
    </aside>
  );
};

AdminSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default AdminSidebar;