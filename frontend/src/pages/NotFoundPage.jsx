// File: /frontend/src/pages/NotFoundPage.jsx
// 404 Not Found page component

import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

/**
 * Not Found page component for 404 errors
 */
const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="error-state">
          <div className="error-state__icon">
            <FaExclamationTriangle />
          </div>
          <h1 className="error-state__title">404</h1>
          <h2 className="error-state__message">Page Not Found</h2>
          <p className="mb-lg">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="error-state__actions">
            <Link to="/" className="btn btn-primary">
              <FaHome className="mr-sm" />
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;