import { useState, FormEvent } from 'react';
import { contactService, IContactFormData } from '../services/contactService';
import { portfolioService } from '../services/portfolioService';
import { useQuery } from '../hooks/useQuery';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import styles from './ContactPage.module.scss';

interface IFormErrors {
  name?: string;
  email?: string;
  message?: string;
}

/**
 * Contact page component
 * Provides a form for users to send messages
 */
const ContactPage = () => {
  const [formData, setFormData] = useState<IContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<IFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get portfolio data for contact information
  const { data: portfolio, isLoading: portfolioLoading, error: portfolioError } = useQuery(
    'portfolio',
    portfolioService.getPortfolio
  );

  const validate = (): boolean => {
    const newErrors: IFormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      await contactService.sendMessage(formData);
      
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while portfolio data is loading
  if (portfolioLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.contactPage}>
      <h1 className={styles.title}>Contact Me</h1>
      <p className={styles.subtitle}>
        Have a question or want to work together? Fill out the form below and I'll get back to you as soon as possible.
      </p>

      <div className={styles.contactContainer}>
        <div className={styles.contactInfo}>
          {portfolioError ? (
            <p className={styles.errorText}>Could not load contact information. Please try again later.</p>
          ) : (
            <>
              <div className={styles.infoBlock}>
                <h3 className={styles.infoTitle}>Email</h3>
                <p className={styles.infoText}>{portfolio?.owner.email || 'contact@example.com'}</p>
              </div>
              
              <div className={styles.infoBlock}>
                <h3 className={styles.infoTitle}>Location</h3>
                <p className={styles.infoText}>{portfolio?.owner.location || 'San Francisco, CA'}</p>
              </div>
              
              <div className={styles.infoBlock}>
                <h3 className={styles.infoTitle}>Social</h3>
                <div className={styles.socialLinks}>
                  {portfolio?.owner.social.github && (
                    <a 
                      href={portfolio.owner.social.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                    >
                      GitHub
                    </a>
                  )}
                  {portfolio?.owner.social.linkedin && (
                    <a 
                      href={portfolio.owner.social.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                    >
                      LinkedIn
                    </a>
                  )}
                  {portfolio?.owner.social.twitter && (
                    <a 
                      href={portfolio.owner.social.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                    >
                      Twitter
                    </a>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className={styles.contactForm}>
          {success ? (
            <div className={styles.successMessage}>
              <h3>Message Sent!</h3>
              <p>Thank you for reaching out. I'll get back to you as soon as possible.</p>
              <button 
                onClick={() => setSuccess(false)}
                className={styles.button}
                aria-label="Send another message"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <div className={styles.errorMessage} role="alert">{error}</div>}
              
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                  placeholder="Your name"
                  aria-required="true"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p className={styles.errorText} id="name-error">{errors.name}</p>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email <span className={styles.required}>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  placeholder="Your email address"
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p className={styles.errorText} id="email-error">{errors.email}</p>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="subject" className={styles.label}>
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="What is this regarding?"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>
                  Message <span className={styles.required}>*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
                  placeholder="Your message"
                  rows={6}
                  aria-required="true"
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                />
                {errors.message && (
                  <p className={styles.errorText} id="message-error">{errors.message}</p>
                )}
              </div>
              
              <button 
                type="submit" 
                className={styles.button}
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;