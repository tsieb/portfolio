// /frontend/src/pages/NotFoundPage.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@context/ThemeContext';
import styles from '@assets/styles/pages/NotFoundPage.module.scss';

/**
 * 404 Not Found page component
 * @returns {JSX.Element} NotFoundPage component
 */
const NotFoundPage = () => {
  const { isDarkMode } = useTheme();
  
  // Set page title
  useEffect(() => {
    document.title = '404 - Page Not Found | Space Portfolio';
  }, []);
  
  return (
    <div className={`${styles.notFoundPage} ${isDarkMode ? styles.dark : ''}`}>
      <div className={styles.content}>
        <div className={styles.errorCode}>404</div>
        
        <h1 className={styles.title}>Lost in Space</h1>
        
        <p className={styles.description}>
          The page you're looking for has drifted into the void or doesn't exist.
        </p>
        
        <div className={styles.actions}>
          <Link to="/" className={styles.homeButton}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Return to Homepage
          </Link>
        </div>
      </div>
      
      <div className={styles.spaceScene}>
        <div className={styles.stars}></div>
        <div className={styles.planet}></div>
        <div className={styles.astronaut}>
          <div className={styles.astronautHelmet}></div>
          <div className={styles.astronautBody}></div>
          <div className={styles.astronautJetpack}>
            <div className={styles.jetpackFlame}></div>
          </div>
        </div>
        <div className={styles.meteor}></div>
        <div className={styles.meteor} style={{ animationDelay: '2s' }}></div>
        <div className={styles.meteor} style={{ animationDelay: '4s' }}></div>
      </div>
    </div>
  );
};

export default NotFoundPage;