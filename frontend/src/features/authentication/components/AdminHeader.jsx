// /frontend/src/features/authentication/components/AdminHeader.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { useTheme } from '@context/ThemeContext';
import ThemeToggle from '@components/ui/ThemeToggle';
import styles from '@assets/styles/features/authentication/AdminHeader.module.scss';

/**
 * Admin header component for admin pages
 * @returns {JSX.Element} AdminHeader component
 */
const AdminHeader = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode } = useTheme();
  
  // Handle logout
  const handleLogout = async () => {
    await logout();
  };
  
  return (
    <header className={`${styles.adminHeader} ${isDarkMode ? styles.dark : ''}`}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/admin" className={styles.logoLink}>
            <span className={styles.logoIcon}>✨</span>
            <span className={styles.logoText}>Portfolio Admin</span>
          </Link>
        </div>
        
        <div className={styles.actions}>
          <ThemeToggle />
          
          {isAuthenticated ? (
            <div className={styles.userSection}>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user?.name || 'Admin'}</span>
                <span className={styles.userEmail}>{user?.email}</span>
              </div>
              
              <button 
                className={styles.logoutButton}
                onClick={handleLogout}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link to="/admin" className={styles.loginLink}>
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;