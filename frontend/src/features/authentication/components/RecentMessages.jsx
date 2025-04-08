// /frontend/src/features/authentication/components/RecentMessages.jsx
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTheme } from '@context/ThemeContext';
import LoadingSpinner from '@components/ui/LoadingSpinner';
import styles from '@assets/styles/features/authentication/RecentMessages.module.scss';

/**
 * Recent messages component for admin dashboard
 * @param {Object} props - Component props
 * @param {Array} props.messages - Array of message objects
 * @param {boolean} props.loading - Whether messages are loading
 * @param {string|null} props.error - Error message if any
 * @returns {JSX.Element} RecentMessages component
 */
const RecentMessages = ({ messages, loading, error }) => {
  const { isDarkMode } = useTheme();
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get status badge for message
  const getStatusBadge = (status) => {
    const statusClasses = {
      new: styles.statusNew,
      read: styles.statusRead,
      replied: styles.statusReplied,
      archived: styles.statusArchived
    };
    
    return (
      <span className={`${styles.statusBadge} ${statusClasses[status] || ''}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  
  // Truncate text
  const truncateText = (text, maxLength = 80) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="medium" />
        <p>Loading messages...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <button className={styles.retryButton}>Retry</button>
      </div>
    );
  }
  
  if (messages.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <p className={styles.emptyMessage}>No messages found</p>
      </div>
    );
  }
  
  return (
    <div className={`${styles.recentMessages} ${isDarkMode ? styles.dark : ''}`}>
      <div className={styles.messagesList}>
        {messages.map((message) => (
          <div key={message.id} className={styles.messageItem}>
            <div className={styles.messageHeader}>
              <div className={styles.messageInfo}>
                <h3 className={styles.messageSender}>{message.name}</h3>
                <span className={styles.messageEmail}>{message.email}</span>
              </div>
              {getStatusBadge(message.status)}
            </div>
            
            <h4 className={styles.messageSubject}>{message.subject}</h4>
            <p className={styles.messageContent}>
              {truncateText(message.message, 120)}
            </p>
            
            <div className={styles.messageFooter}>
              <span className={styles.messageDate}>
                {formatDate(message.createdAt)}
              </span>
              
              <div className={styles.messageActions}>
                <button className={styles.messageAction}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  <span>Reply</span>
                </button>
                
                <button className={styles.messageAction}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="M12 5v14"></path>
                  </svg>
                  <span>Mark as {message.status === 'new' ? 'Read' : 'New'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.viewAllContainer}>
        <Link to="/admin/messages" className={styles.viewAllButton}>
          View All Messages
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </Link>
      </div>
    </div>
  );
};

RecentMessages.propTypes = {
  messages: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string
};

RecentMessages.defaultProps = {
  loading: false,
  error: null
};

export default RecentMessages;