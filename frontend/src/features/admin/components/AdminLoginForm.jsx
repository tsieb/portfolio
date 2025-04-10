// File: /frontend/src/features/admin/components/AdminLoginForm.jsx
// Admin login form component

import { Link } from 'react-router-dom';
import { FaLock, FaEnvelope, FaUserShield, FaArrowLeft } from 'react-icons/fa';

const AdminLoginForm = ({ 
  formData, 
  formErrors, 
  isSubmitting,
  error, 
  handleChange, 
  handleSubmit 
}) => {
  return (
    <div className="card__body">
      {error && (
        <div className="alert alert--error mb-lg">
          <FaLock className="alert__icon" />
          <div className="alert__content">
            <span>{error}</span>
          </div>
        </div>
      )}
      
      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <div className="form-input-group">
            <div className="form-input-icon">
              <FaEnvelope />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input form-input--with-icon ${formErrors.email ? 'form-input--error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your admin email"
              disabled={isSubmitting}
              autoComplete="email"
              required
            />
          </div>
          {formErrors.email && (
            <div className="form-error">{formErrors.email}</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <div className="form-input-group">
            <div className="form-input-icon">
              <FaLock />
            </div>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-input form-input--with-icon ${formErrors.password ? 'form-input--error' : ''}`}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={isSubmitting}
              autoComplete="current-password"
              required
            />
          </div>
          {formErrors.password && (
            <div className="form-error">{formErrors.password}</div>
          )}
        </div>
        
        <button
          type="submit"
          className="btn btn-primary w-full mb-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="spinner spinner--sm mr-sm"></div>
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign In to Admin</span>
          )}
        </button>
      </form>
      
      <Link to="/login" className="btn btn-text flex-center">
        <FaArrowLeft className="mr-sm" />
        Back to main login
      </Link>
    </div>
  );
};

export default AdminLoginForm;