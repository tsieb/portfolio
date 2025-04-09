// File: /frontend/src/App.jsx
// Main App component with updated routing for music sharing platform

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
import SpotifyAuthCallbackPage from './pages/SpotifyAuthCallbackPage';

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
    return <div className="loading-container">Loading...</div>;
  }
  
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

// Protected route wrapper for user routes
const UserRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="loading-container">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App = () => {
  const { checkAuth } = useAuth();
  
  useEffect(() => {
    // Check authentication status on initial load
    checkAuth();
  }, [checkAuth]);
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="auth/spotify/callback" element={<SpotifyAuthCallbackPage />} />
      </Route>
      
      {/* User profile routes - publicly accessible */}
      <Route path="/:username" element={<UserLayout />}>
        <Route index element={<UserProfilePage />} />
      </Route>
      
      {/* User settings routes - protected */}
      <Route path="/settings" element={
        <UserRoute>
          <MainLayout />
        </UserRoute>
      }>
        <Route index element={<UserSettingsPage />} />
      </Route>
      
      {/* Admin login - public */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      
      {/* Admin routes - protected */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }>
        <Route index element={<AdminDashboardPage />} />
        <Route path="tracks" element={<AdminTracksPage />} />
        <Route path="users" element={<AdminUsersPage />} />
      </Route>
      
      {/* Catch all route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;