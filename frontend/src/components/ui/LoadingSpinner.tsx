import styles from './LoadingSpinner.module.scss';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  fullPage?: boolean;
}

/**
 * Loading spinner component
 * Displays a centered loading spinner
 */
const LoadingSpinner = ({ size = 'medium', fullPage = false }: LoadingSpinnerProps) => {
  const spinnerClass = `${styles.spinner} ${styles[size]} ${fullPage ? styles.fullPage : ''}`;
  
  return (
    <div className={spinnerClass} role="status" aria-label="Loading">
      <div className={styles.spinnerInner}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <span className={styles.srOnly}>Loading...</span>
    </div>
  );
};

export default LoadingSpinner;