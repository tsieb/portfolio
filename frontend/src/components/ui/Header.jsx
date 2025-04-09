// File: /frontend/src/components/ui/Header.jsx
// Enhanced header with modern styling and animations

import { Link, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { FaSpotify, FaGithub, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import './Header.scss';

/**
 * Enhanced header component with navigation links
 */
const Header = () => {
  const { isAuthenticated, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
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
  
  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="container">
        <div className="header__inner">
          <div className="header__logo">
            <Link to="/" className="header__logo-link">
              <span className="header__logo-icon"><FaSpotify /></span>
              <span className="header__logo-text">Music Portfolio</span>
            </Link>
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
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </NavLink>
              </li>
              <li className="header__nav-item">
                <a 
                  href="https://github.com"
                  className="header__nav-link header__nav-link--with-icon"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub className="header__nav-icon" />
                  <span>GitHub</span>
                </a>
              </li>
              {isAuthenticated ? (
                <li className="header__nav-item">
                  <NavLink 
                    to="/admin" 
                    className={({ isActive }) => 
                      isActive 
                        ? 'header__nav-link header__nav-link--admin active' 
                        : 'header__nav-link header__nav-link--admin'
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaUser className="header__nav-icon" />
                    <span>Admin</span>
                  </NavLink>
                </li>
              ) : (
                <li className="header__nav-item">
                  <NavLink 
                    to="/login" 
                    className={({ isActive }) => 
                      isActive 
                        ? 'header__nav-link header__nav-link--login active' 
                        : 'header__nav-link header__nav-link--login'
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaUser className="header__nav-icon" />
                    <span>Login</span>
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