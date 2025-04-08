import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { useThemeContext } from '../../context/ThemeContext';
import styles from './Header.module.scss';

/**
 * Header component with navigation
 */
const Header = () => {
  const { isAuthenticated, logout } = useAuthContext();
  const { theme, toggleTheme } = useThemeContext();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          Portfolio
        </Link>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link to="/" className={styles.navLink}>Home</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/projects" className={styles.navLink}>Projects</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/contact" className={styles.navLink}>Contact</Link>
            </li>
            {isAuthenticated ? (
              <li className={styles.navItem}>
                <button onClick={logout} className={styles.navButton}>Logout</button>
              </li>
            ) : (
              <li className={styles.navItem}>
                <Link to="/login" className={styles.navLink}>Login</Link>
              </li>
            )}
            <li className={styles.navItem}>
              <button 
                onClick={toggleTheme} 
                className={styles.themeToggle}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;