// File: /frontend/src/components/ui/Header.jsx
// Header component for main layout

import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './Header.scss';

/**
 * Header component with navigation links
 */
const Header = () => {
  const { isAuthenticated, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  return (
    <header className="header">
      <div className="container">
        <div className="header__inner">
          <div className="header__logo">
            <Link to="/" className="header__logo-link">
              My Portfolio
            </Link>
          </div>
          
          <button 
            className="header__toggle"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className="header__toggle-icon"></span>
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
                <a 
                  href="https://github.com"
                  className="header__nav-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
              {isAuthenticated ? (
                <li className="header__nav-item">
                  <NavLink 
                    to="/admin" 
                    className={({ isActive }) => 
                      isActive ? 'header__nav-link active' : 'header__nav-link'
                    }
                  >
                    Admin
                  </NavLink>
                </li>
              ) : (
                <li className="header__nav-item">
                  <NavLink 
                    to="/login" 
                    className={({ isActive }) => 
                      isActive ? 'header__nav-link active' : 'header__nav-link'
                    }
                  >
                    Login
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;