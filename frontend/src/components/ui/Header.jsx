// /frontend/src/components/ui/Header.jsx
import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '@context/ThemeContext';
import ThemeToggle from '@components/ui/ThemeToggle';
import styles from '@assets/styles/components/Header.module.scss';

/**
 * Header component for the main layout
 * @returns {JSX.Element} Header component
 */
const Header = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <header className={`${styles.header} ${isDarkMode ? styles.dark : ''}`}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoText}>Space Portfolio</span>
        </Link>
        
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => isActive ? styles.active : ''}
                end
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/contact" 
                className={({ isActive }) => isActive ? styles.active : ''}
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>
        
        <div className={styles.actions}>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;