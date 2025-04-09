// File: /frontend/src/components/ui/Footer.jsx
// Footer component for main layout

import { Link } from 'react-router-dom';
import './Footer.scss';

/**
 * Footer component with copyright and links
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          <div className="footer__copyright">
            &copy; {currentYear} My Portfolio. All rights reserved.
          </div>
          
          <div className="footer__links">
            <Link to="/" className="footer__link">
              Home
            </Link>
            <a 
              href="https://github.com"
              className="footer__link"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <Link to="/login" className="footer__link">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;