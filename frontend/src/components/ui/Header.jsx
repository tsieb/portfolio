// File: /frontend/src/components/ui/Header.jsx
// Main header component for the application

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
          <div className="header__left">
            <Link to="/" className="header__brand">
              <span className="header__logo-icon"><FaHeadphones /></span>
              <span className="header__logo-text">Music Activity</span>
            </Link>
          </div>
          
          <div className="header__center">
            <div className="search-input">
              <input 
                type="text" 
                placeholder="Search users..." 
                className="search-input__field"
              />
              <FaSearch className="search-input__icon" />
            </div>
          </div>
          
          <button 
            className="header__toggle"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
          
          <nav className={`nav ${menuOpen ? 'nav--open' : ''}`}>
            <ul className="nav__list">
              <li className="nav__item">
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    isActive ? 'nav__link active' : 'nav__link'
                  }
                  end
                >
                  Home
                </NavLink>
              </li>
              <li className="nav__item">
                <NavLink 
                  to="/discover" 
                  className={({ isActive }) => 
                    isActive ? 'nav__link active' : 'nav__link'
                  }
                >
                  Discover
                </NavLink>
              </li>
              
              {isAuthenticated ? (
                <>
                  <li className="nav__item nav__item--mobile">
                    <NavLink 
                      to={`/user/${user?.username || ''}`} 
                      className={({ isActive }) => 
                        isActive ? 'nav__link active' : 'nav__link'
                      }
                    >
                      My Profile
                    </NavLink>
                  </li>
                  <li className="nav__item nav__item--mobile">
                    <NavLink 
                      to="/settings" 
                      className={({ isActive }) => 
                        isActive ? 'nav__link active' : 'nav__link'
                      }
                    >
                      Settings
                    </NavLink>
                  </li>
                  <li className="nav__item nav__item--mobile">
                    <button 
                      className="nav__link nav__link--button"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className="nav__link-icon" />
                      <span>Logout</span>
                    </button>
                  </li>
                  
                  <li className="nav__item nav__item--desktop">
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
                        <div className="header__user-menu">
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
                  <li className="nav__item">
                    <NavLink 
                      to="/login" 
                      className={({ isActive }) => 
                        isActive 
                          ? 'nav__button nav__button--login active' 
                          : 'nav__button nav__button--login'
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