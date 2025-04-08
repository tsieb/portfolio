// /frontend/src/layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Header from '@components/ui/Header';
import Footer from '@components/ui/Footer';
import { useTheme } from '@context/ThemeContext';

/**
 * Main layout for public-facing pages
 * @returns {JSX.Element} MainLayout component
 */
const MainLayout = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`app-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;