import styles from './ErrorMessage.module.scss';

interface ErrorMessageProps {
  message: string;
  retryFn?: () => void;
}

/**
 * Error message component
 * Displays an error message with optional retry button
 */
const ErrorMessage = ({ message, retryFn }: ErrorMessageProps) => {
  return (
    <div className={styles.errorContainer} role="alert">
      <div className={styles.errorContent}>
        <h3 className={styles.errorTitle}>Error</h3>
        <p className={styles.errorMessage}>{message}</p>
        {retryFn && (
          <button onClick={retryFn} className={styles.retryButton}>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;