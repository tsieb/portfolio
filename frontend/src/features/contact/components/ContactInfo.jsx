// /frontend/src/features/contact/components/ContactInfo.jsx
import { useTheme } from '@context/ThemeContext';
import styles from '@assets/styles/features/contact/ContactInfo.module.scss';

/**
 * Contact information component with contact details
 * @returns {JSX.Element} ContactInfo component
 */
const ContactInfo = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`${styles.contactInfo} ${isDarkMode ? styles.dark : ''}`}>
      <h2 className={styles.title}>Contact Information</h2>
      <p className={styles.subtitle}>
        I'm open to freelance opportunities, collaborations, and discussing new ideas.
      </p>
      
      <div className={styles.infoItems}>
        <div className={styles.infoItem}>
          <div className={styles.iconContainer}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </div>
          <div className={styles.infoContent}>
            <h3 className={styles.infoTitle}>Phone</h3>
            <p className={styles.infoText}>(123) 456-7890</p>
          </div>
        </div>
        
        <div className={styles.infoItem}>
          <div className={styles.iconContainer}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
          <div className={styles.infoContent}>
            <h3 className={styles.infoTitle}>Email</h3>
            <p className={styles.infoText}>contact@example.com</p>
          </div>
        </div>
        
        <div className={styles.infoItem}>
          <div className={styles.iconContainer}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <div className={styles.infoContent}>
            <h3 className={styles.infoTitle}>Location</h3>
            <p className={styles.infoText}>San Francisco, CA</p>
          </div>
        </div>
      </div>
      
      <div className={styles.socialLinks}>
        <h3 className={styles.socialTitle}>Connect with me</h3>
        <div className={styles.socialIcons}>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="LinkedIn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Twitter">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
            </svg>
          </a>
          <a href="https://dribbble.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Dribbble">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"></path>
            </svg>
          </a>
        </div>
      </div>
      
      <div className={styles.availability}>
        <div className={styles.availabilityStatus}>
          <span className={styles.availabilityDot}></span>
          <span className={styles.availabilityText}>Currently available for projects</span>
        </div>
        <p className={styles.availabilityNote}>
          Response time: within 24-48 hours
        </p>
      </div>
    </div>
  );
};

export default ContactInfo;