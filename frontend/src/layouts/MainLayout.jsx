// File: /frontend/src/layouts/MainLayout.jsx
// Main layout component for public pages

import { Outlet } from 'react-router-dom';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

/**
 * Main layout component for the public-facing pages
 * Includes the header, footer, and outlet for nested routes
 */
const MainLayout = () => {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;