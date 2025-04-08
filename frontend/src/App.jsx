// /frontend/src/App.jsx
import { Routes, Route } from 'react-router-dom';
import MainLayout from '@layouts/MainLayout';
import AdminLayout from '@layouts/AdminLayout';
import HomePage from '@pages/HomePage';
import ProjectPage from '@pages/ProjectPage';
import ContactPage from '@pages/ContactPage';
import AdminLoginPage from '@pages/AdminLoginPage';
import AdminDashboardPage from '@pages/AdminDashboardPage';
import AdminProjectsPage from '@pages/AdminProjectsPage';
import AdminProjectEditPage from '@pages/AdminProjectEditPage';
import NotFoundPage from '@pages/NotFoundPage';
import ProtectedRoute from '@components/ui/ProtectedRoute';
import { useAuth } from '@context/AuthContext';

/**
 * Main application component with routing
 * @returns {JSX.Element} App component
 */
const App = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="projects/:projectId" element={<ProjectPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminLoginPage />} />
        <Route element={<ProtectedRoute isAllowed={isAuthenticated && isAdmin} redirectPath="/admin" />}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="projects" element={<AdminProjectsPage />} />
          <Route path="projects/:projectId" element={<AdminProjectEditPage />} />
          <Route path="projects/new" element={<AdminProjectEditPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;