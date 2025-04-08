// /frontend/src/pages/ContactPage.jsx
import { useEffect } from 'react';
import ContactForm from '@features/contact/components/ContactForm';
import ContactInfo from '@features/contact/components/ContactInfo';
import styles from '@assets/styles/pages/ContactPage.module.scss';

/**
 * Contact page component with form and information
 * @returns {JSX.Element} ContactPage component
 */
const ContactPage = () => {
  // Set page title
  useEffect(() => {
    document.title = 'Contact | Space Portfolio';
  }, []);
  
  return (
    <div className={styles.contactPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Contact</h1>
          <p className={styles.subtitle}>
            Let's connect and discuss how we can work together
          </p>
        </div>
        
        <div className={styles.content}>
          <div className={styles.formSection}>
            <ContactForm />
          </div>
          
          <div className={styles.infoSection}>
            <ContactInfo />
          </div>
        </div>
      </div>
      
      <div className={styles.spaceDecoration}>
        <div className={styles.stars}></div>
        <div className={styles.twinklingStar} style={{ top: '20%', left: '10%', animationDelay: '0s' }}></div>
        <div className={styles.twinklingStar} style={{ top: '15%', right: '20%', animationDelay: '0.5s' }}></div>
        <div className={styles.twinklingStar} style={{ bottom: '30%', left: '15%', animationDelay: '1s' }}></div>
        <div className={styles.twinklingStar} style={{ bottom: '10%', right: '10%', animationDelay: '1.5s' }}></div>
        <div className={styles.meteor}></div>
      </div>
    </div>
  );
};

export default ContactPage;