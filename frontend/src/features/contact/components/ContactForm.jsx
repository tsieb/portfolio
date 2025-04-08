// /frontend/src/features/contact/components/ContactForm.jsx
import { useState } from 'react';
import { useTheme } from '@context/ThemeContext';
import contactService from '@services/contactService';
import LoadingSpinner from '@components/ui/LoadingSpinner';
import styles from '@assets/styles/features/contact/ContactForm.module.scss';

/**
 * Contact form component for sending messages
 * @returns {JSX.Element} ContactForm component
 */
const ContactForm = () => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    subject: false,
    message: false
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear field errors when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  // Handle field blur for validation
  const handleBlur = (e) => {
    const { name } = e.target;
    
    setTouched({
      ...touched,
      [name]: true
    });
    
    // Validate field on blur
    validateField(name, formData[name]);
  };
  
  // Validate individual field
  const validateField = (name, value) => {
    let errorMessage = null;
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          errorMessage = 'Name is required';
        }
        break;
      case 'email':
        if (!value.trim()) {
          errorMessage = 'Email is required';
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
          errorMessage = 'Please enter a valid email address';
        }
        break;
      case 'subject':
        if (!value.trim()) {
          errorMessage = 'Subject is required';
        }
        break;
      case 'message':
        if (!value.trim()) {
          errorMessage = 'Message is required';
        } else if (value.trim().length < 10) {
          errorMessage = 'Message must be at least 10 characters';
        }
        break;
      default:
        break;
    }
    
    setFormErrors({
      ...formErrors,
      [name]: errorMessage
    });
    
    return !errorMessage;
  };
  
  // Validate all fields
  const validateForm = () => {
    const errors = {};
    let isValid = true;
    
    Object.keys(formData).forEach(key => {
      const fieldIsValid = validateField(key, formData[key]);
      isValid = isValid && fieldIsValid;
    });
    
    setFormErrors(errors);
    
    // Also set all fields as touched
    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true
    });
    
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submitting
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Submit form data to API
      await contactService.sendMessage(formData);
      
      // Show success message
      setSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      setTouched({
        name: false,
        email: false,
        subject: false,
        message: false
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.contactForm} ${isDarkMode ? styles.dark : ''}`}>
      <h2 className={styles.title}>Get In Touch</h2>
      <p className={styles.subtitle}>
        Have a question or want to work together? Send me a message!
      </p>
      
      {success && (
        <div className={styles.successMessage}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>Message sent successfully! I'll get back to you soon.</span>
        </div>
      )}
      
      {error && (
        <div className={styles.errorMessage}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${styles.input} ${formErrors.name && touched.name ? styles.inputError : ''}`}
              placeholder="Your name"
              disabled={loading}
            />
            {formErrors.name && touched.name && (
              <p className={styles.errorText}>{formErrors.name}</p>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${styles.input} ${formErrors.email && touched.email ? styles.inputError : ''}`}
              placeholder="Your email address"
              disabled={loading}
            />
            {formErrors.email && touched.email && (
              <p className={styles.errorText}>{formErrors.email}</p>
            )}
          </div>
          
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="subject" className={styles.label}>
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${styles.input} ${formErrors.subject && touched.subject ? styles.inputError : ''}`}
              placeholder="Message subject"
              disabled={loading}
            />
            {formErrors.subject && touched.subject && (
              <p className={styles.errorText}>{formErrors.subject}</p>
            )}
          </div>
          
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="message" className={styles.label}>
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${styles.textarea} ${formErrors.message && touched.message ? styles.inputError : ''}`}
              placeholder="Your message"
              rows={6}
              disabled={loading}
            ></textarea>
            {formErrors.message && touched.message && (
              <p className={styles.errorText}>{formErrors.message}</p>
            )}
          </div>
        </div>
        
        <div className={styles.formActions}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? (
              <>
                <LoadingSpinner size="small" color="white" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
                <span>Send Message</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;