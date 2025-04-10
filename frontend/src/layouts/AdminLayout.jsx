// File: /frontend/src/layouts/AdminLayout.jsx
// Admin layout component for admin pages

import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import { useAuth } from '../features/auth/hooks/useAuth';

/**
 * Admin layout component for the admin dashboard
 * Includes the admin header, sidebar, and outlet for nested routes
 */
const AdminLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <AdminHeader 
          user={user} 
          onLogout={logout} 
          onMenuClick={toggleSidebar} 
        />
        <main className="admin-content py-lg">
          <div className="container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;