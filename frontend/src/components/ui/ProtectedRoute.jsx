// /frontend/src/components/ui/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Protected route component that redirects unauthorized users
 * @param {Object} props - Component props
 * @param {boolean} props.isAllowed - Whether the user is allowed to access the route
 * @param {string} props.redirectPath - Path to redirect to if not allowed
 * @returns {JSX.Element} Outlet or Navigate component
 */
const ProtectedRoute = ({ isAllowed, redirectPath }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  
  return <Outlet />;
};

ProtectedRoute.propTypes = {
  isAllowed: PropTypes.bool.isRequired,
  redirectPath: PropTypes.string.isRequired
};

export default ProtectedRoute;