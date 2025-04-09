// File: /frontend/src/layouts/UserLayout.jsx
// Layout component for user profile pages

import { Outlet } from 'react-router-dom';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

/**
 * Layout component for user profile pages
 * Similar to main layout but with specific styling for user profiles
 */
const UserLayout = () => {
  return (
    <div className="user-layout">
      <Header />
      <main className="user-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;