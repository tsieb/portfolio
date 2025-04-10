// File: /frontend/src/components/ui/Footer.jsx
// Main footer component for the application

import { Link } from 'react-router-dom';
import { FaHeadphones, FaMusic, FaGithub, FaLinkedin, FaHeart } from 'react-icons/fa';

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
                <FaHeadphones className="footer__logo-icon" />
                <span className="footer__logo-text">Music Activity</span>
              </div>
              <p className="footer__tagline">
                Showcase your music taste with live streaming data
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
              &copy; {currentYear} Music Activity. All rights reserved.
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