import styles from './Footer.module.scss';

/**
 * Footer component
 */
const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} Portfolio. All rights reserved.
        </p>
        <div className={styles.social}>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.socialLink}
            aria-label="GitHub"
          >
            GitHub
          </a>
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.socialLink}
            aria-label="LinkedIn"
          >
            LinkedIn
          </a>
          <a 
            href="https://twitter.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.socialLink}
            aria-label="Twitter"
          >
            Twitter
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;