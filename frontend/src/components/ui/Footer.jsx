// File: /frontend/src/components/ui/Footer.jsx
// Enhanced footer component with modern styling and animations

import { Link } from 'react-router-dom';
import { FaSpotify, FaGithub, FaLinkedin, FaHeart } from 'react-icons/fa';
import './Footer.scss';

/**
 * Enhanced footer component with modern styling
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer__bg-shape"></div>
      
      <div className="container">
        <div className="footer__inner">
          <div className="footer__top">
            <div className="footer__brand">
              <div className="footer__logo">
                <FaSpotify className="footer__logo-icon" />
                <span className="footer__logo-text">Music Portfolio</span>
              </div>
              <p className="footer__tagline">
                Showcasing web development skills with real-time Spotify integration
              </p>
            </div>
            
            <div className="footer__links">
              <div className="footer__links-group">
                <h3 className="footer__links-title">Navigation</h3>
                <ul className="footer__links-list">
                  <li>
                    <Link to="/" className="footer__link">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className="footer__link">
                      Admin Login
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div className="footer__links-group">
                <h3 className="footer__links-title">Connect</h3>
                <ul className="footer__links-list">
                  <li>
                    <a 
                      href="https://github.com"
                      className="footer__link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaGithub className="footer__link-icon" />
                      <span>GitHub</span>
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://linkedin.com"
                      className="footer__link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedin className="footer__link-icon" />
                      <span>LinkedIn</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="footer__bottom">
            <div className="footer__copyright">
              &copy; {currentYear} Music Portfolio. All rights reserved.
            </div>
            
            <div className="footer__made-with">
              <span>Made with</span>
              <FaHeart className="footer__heart" />
              <span>and React</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;