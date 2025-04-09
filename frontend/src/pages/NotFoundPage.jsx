// File: /frontend/src/pages/NotFoundPage.jsx
// 404 Not Found page component

import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';
import './NotFoundPage.scss';

/**
 * Not Found page component for 404 errors
 */
const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-icon">
          <FaExclamationTriangle size={64} />
        </div>
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-message">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary not-found-button">
          <FaHome className="mr-sm" />
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;