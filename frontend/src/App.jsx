// File: /frontend/src/App.jsx
// Main application component with updated routes for authentication flow

import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './features/auth/hooks/useAuth';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import AuthCallbackPage from './pages/AuthCallbackPage';

// User Pages
import UserProfilePage from './pages/UserProfilePage';
import UserSettingsPage from './pages/UserSettingsPage';

// Admin Pages
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminTracksPage from './pages/AdminTracksPage';
import AdminUsersPage from './pages/AdminUsersPage';

// Protected route wrapper for admin routes
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

// Protected route wrapper for user routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  const { checkAuth } = useAuth();

  // Check authentication status when app loads
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="auth/callback" element={<AuthCallbackPage />} />
      </Route>

      {/* User profile routes - publicly accessible but with privacy controls */}
      <Route path="/user/:username" element={<UserLayout />}>
        <Route index element={<UserProfilePage />} />
      </Route>

      {/* User settings - protected route */}
      <Route path="/settings" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<UserSettingsPage />} />
      </Route>

      {/* Admin login - public */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin routes - protected and require admin role */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }>
        <Route index element={<AdminDashboardPage />} />
        <Route path="tracks" element={<AdminTracksPage />} />
        <Route path="users" element={<AdminUsersPage />} />
      </Route>

      {/* Catch-all route for 404 errors */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;