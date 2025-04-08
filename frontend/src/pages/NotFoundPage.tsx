import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.scss';

/**
 * Not found (404) page component
 */
const NotFoundPage = () => {
  return (
    <div className={styles.notFoundPage}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Page Not Found</h2>
        <p className={styles.message}>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className={styles.button}>
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;