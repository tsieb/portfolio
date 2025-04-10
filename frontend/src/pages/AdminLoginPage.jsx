// File: /frontend/src/pages/AdminLoginPage.jsx
// Admin login page with link back to main login

import { Navigate } from 'react-router-dom';
import { FaUserShield } from 'react-icons/fa';
import { useAdminLogin } from '../features/admin/hooks/useAdminLogin';
import AdminLoginForm from '../features/admin/components/AdminLoginForm';

const AdminLoginPage = () => {
  const {
    isAuthenticated,
    isAdmin,
    isLoading,
    error,
    formData,
    formErrors,
    isSubmitting,
    isVisible,
    handleChange,
    handleSubmit
  } = useAdminLogin();
  
  // If already authenticated as admin, redirect to admin dashboard
  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  
  // If authenticated but not admin, redirect to home
  if (isAuthenticated && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="admin-login-page">
        <div className="page-loading">
          <div className="spinner spinner--lg page-loading__spinner"></div>
          <p className="page-loading__text">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`admin-login-page ${isVisible ? 'is-visible' : ''}`}>
      <div className="card">
        <div className="card__header">
          <div className="flex-center mb-md">
            <FaUserShield className="text-electric-cyan" style={{ fontSize: '3rem' }} />
          </div>
          <h1 className="text-center">Admin Login</h1>
          <p className="text-center text-secondary mb-lg">Secure access for administrators only</p>
        </div>
        
        <AdminLoginForm
          formData={formData}
          formErrors={formErrors}
          isSubmitting={isSubmitting}
          error={error}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default AdminLoginPage;