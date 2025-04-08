// /frontend/src/layouts/AdminLayout.jsx
import { Outlet } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import AdminHeader from '@features/authentication/components/AdminHeader';
import AdminSidebar from '@features/authentication/components/AdminSidebar';
import { useTheme } from '@context/ThemeContext';

/**
 * Admin layout for administrative pages
 * @returns {JSX.Element} AdminLayout component
 */
const AdminLayout = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`admin-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <AdminHeader />
      <div className="admin-content-wrapper">
        {isAuthenticated && isAdmin && <AdminSidebar />}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;