// File: /frontend/src/components/ui/Header.jsx
// Modified header to use music icon instead of Spotify logo

import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { 
  FaMusic, 
  FaHeadphones,
  FaUserCircle, 
  FaBars, 
  FaTimes, 
  FaSearch,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa';
import '../../assets/styles/components/ui/Header.scss';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    // Close user menu if open
    if (userMenuOpen) setUserMenuOpen(false);
  };
  
  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setUserMenuOpen(!userMenuOpen);
  };
  
  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
  };
  
  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (userMenuOpen) setUserMenuOpen(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [userMenuOpen]);
  
  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
  // Close menus when changing routes
  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);
  
  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="container">
        <div className="header__inner">
          <div className="header__logo">
            <Link to="/" className="header__logo-link">
              <span className="header__logo-icon"><FaHeadphones /></span>
              <span className="header__logo-text">Music Activity</span>
            </Link>
          </div>
          
          <div className="header__search">
            <div className="header__search-input">
              <FaSearch className="header__search-icon" />
              <input 
                type="text" 
                placeholder="Search users..." 
                className="header__search-field"
              />
            </div>
          </div>
          
          <button 
            className="header__toggle"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
          
          <nav className={`header__nav ${menuOpen ? 'open' : ''}`}>
            <ul className="header__nav-list">
              <li className="header__nav-item">
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    isActive ? 'header__nav-link active' : 'header__nav-link'
                  }
                  end
                >
                  Home
                </NavLink>
              </li>
              <li className="header__nav-item">
                <NavLink 
                  to="/discover" 
                  className={({ isActive }) => 
                    isActive ? 'header__nav-link active' : 'header__nav-link'
                  }
                >
                  Discover
                </NavLink>
              </li>
              
              {isAuthenticated ? (
                <>
                  <li className="header__nav-item header__nav-item--mobile">
                    <NavLink 
                      to={`/user/${user?.username || ''}`} 
                      className={({ isActive }) => 
                        isActive ? 'header__nav-link active' : 'header__nav-link'
                      }
                    >
                      My Profile
                    </NavLink>
                  </li>
                  <li className="header__nav-item header__nav-item--mobile">
                    <NavLink 
                      to="/settings" 
                      className={({ isActive }) => 
                        isActive ? 'header__nav-link active' : 'header__nav-link'
                      }
                    >
                      Settings
                    </NavLink>
                  </li>
                  <li className="header__nav-item header__nav-item--mobile">
                    <button 
                      className="header__nav-link header__nav-link--button"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className="header__nav-icon" />
                      <span>Logout</span>
                    </button>
                  </li>
                  
                  <li className="header__nav-item header__nav-item--desktop">
                    <div className="header__user" onClick={toggleUserMenu}>
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.displayName || user.username} 
                          className="header__user-avatar" 
                        />
                      ) : (
                        <FaUserCircle className="header__user-avatar-icon" />
                      )}
                      <span className="header__user-name">
                        {user?.displayName || user?.username || 'User'}
                      </span>
                      
                      {userMenuOpen && (
                        <div className="header__user-menu" onClick={e => e.stopPropagation()}>
                          <div className="header__user-menu-header">
                            <strong>Signed in as</strong>
                            <div>{user?.email}</div>
                          </div>
                          
                          <Link to={`/user/${user?.username || ''}`} className="header__user-menu-item">
                            <FaUserCircle className="header__user-menu-icon" />
                            <span>My Profile</span>
                          </Link>
                          
                          <Link to="/settings" className="header__user-menu-item">
                            <FaCog className="header__user-menu-icon" />
                            <span>Settings</span>
                          </Link>
                          
                          <div className="header__user-menu-divider"></div>
                          
                          <button 
                            className="header__user-menu-item header__user-menu-item--button"
                            onClick={handleLogout}
                          >
                            <FaSignOutAlt className="header__user-menu-icon" />
                            <span>Logout</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                </>
              ) : (
                <>
                  <li className="header__nav-item">
                    <NavLink 
                      to="/login" 
                      className={({ isActive }) => 
                        isActive 
                          ? 'header__nav-link header__nav-link--login active' 
                          : 'header__nav-link header__nav-link--login'
                      }
                    >
                      <span>Login</span>
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;