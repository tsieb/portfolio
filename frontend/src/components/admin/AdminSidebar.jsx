// File: /frontend/src/components/admin/AdminSidebar.jsx
// Admin sidebar component with navigation links

import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { 
  FaTimes, 
  FaHome, 
  FaMusic, 
  FaChartBar, 
  FaUsers, 
  FaCog, 
  FaEye,
  FaHeadphones
} from 'react-icons/fa';

/**
 * Admin sidebar component with navigation links
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the sidebar is open (mobile only)
 * @param {Function} props.onClose - Close sidebar handler function
 */
const AdminSidebar = ({ isOpen, onClose }) => {
  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'is-open' : ''}`} onClick={onClose}></div>
      <aside className={`sidebar sidebar--admin ${isOpen ? 'is-open' : ''}`}>
        <div className="sidebar__header">
          <div className="sidebar__title">
            <FaHeadphones className="sidebar__title-icon" />
            <span>Music Admin</span>
          </div>
          <button 
            className="sidebar__close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <FaTimes size={18} />
          </button>
        </div>
        
        <div className="sidebar__content">
          <nav className="sidebar__nav">
            <div className="sidebar__nav-group">
              <div className="sidebar__divider">Dashboard</div>
              <div className="sidebar__nav-item">
                <NavLink 
                  to="/admin" 
                  end
                  className={({ isActive }) => 
                    isActive ? 'sidebar__nav-link active' : 'sidebar__nav-link'
                  }
                >
                  <FaHome className="sidebar__nav-icon" />
                  Overview
                </NavLink>
              </div>
            </div>
            
            <div className="sidebar__nav-group">
              <div className="sidebar__divider">Music</div>
              <div className="sidebar__nav-item">
                <NavLink 
                  to="/admin/tracks" 
                  className={({ isActive }) => 
                    isActive ? 'sidebar__nav-link active' : 'sidebar__nav-link'
                  }
                >
                  <FaMusic className="sidebar__nav-icon" />
                  Track History
                </NavLink>
              </div>
              <div className="sidebar__nav-item">
                <NavLink 
                  to="/admin/stats" 
                  className={({ isActive }) => 
                    isActive ? 'sidebar__nav-link active' : 'sidebar__nav-link'
                  }
                >
                  <FaChartBar className="sidebar__nav-icon" />
                  Analytics
                </NavLink>
              </div>
            </div>
            
            <div className="sidebar__nav-group">
              <div className="sidebar__divider">Users</div>
              <div className="sidebar__nav-item">
                <NavLink 
                  to="/admin/users" 
                  className={({ isActive }) => 
                    isActive ? 'sidebar__nav-link active' : 'sidebar__nav-link'
                  }
                >
                  <FaUsers className="sidebar__nav-icon" />
                  Manage Users
                </NavLink>
              </div>
              <div className="sidebar__nav-item">
                <NavLink 
                  to="/admin/user-activity" 
                  className={({ isActive }) => 
                    isActive ? 'sidebar__nav-link active' : 'sidebar__nav-link'
                  }
                >
                  <FaEye className="sidebar__nav-icon" />
                  User Activity
                </NavLink>
              </div>
            </div>
            
            <div className="sidebar__nav-group">
              <div className="sidebar__divider">System</div>
              <div className="sidebar__nav-item">
                <NavLink 
                  to="/admin/settings" 
                  className={({ isActive }) => 
                    isActive ? 'sidebar__nav-link active' : 'sidebar__nav-link'
                  }
                >
                  <FaCog className="sidebar__nav-icon" />
                  Settings
                </NavLink>
              </div>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

AdminSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default AdminSidebar;