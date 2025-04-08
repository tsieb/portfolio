import { useState, FormEvent } from 'react';
import api from '../lib/axios';
import styles from './ContactPage.module.scss';

interface IFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

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
  const [formData, setFormData] = useState<IFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<IFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      
      await api.post('/contact', formData);
      
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.response?.data?.message || 'Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.contactPage}>
      <h1 className={styles.title}>Contact Me</h1>
      <p className={styles.subtitle}>
        Have a question or want to work together? Fill out the form below and I'll get back to you as soon as possible.
      </p>

      <div className={styles.contactContainer}>
        <div className={styles.contactInfo}>
          <div className={styles.infoBlock}>
            <h3 className={styles.infoTitle}>Email</h3>
            <p className={styles.infoText}>john@example.com</p>
          </div>
          
          <div className={styles.infoBlock}>
            <h3 className={styles.infoTitle}>Location</h3>
            <p className={styles.infoText}>San Francisco, CA</p>
          </div>
          
          <div className={styles.infoBlock}>
            <h3 className={styles.infoTitle}>Social</h3>
            <div className={styles.socialLinks}>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                GitHub
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                LinkedIn
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                Twitter
              </a>
            </div>
          </div>
        </div>

        <div className={styles.contactForm}>
          {success ? (
            <div className={styles.successMessage}>
              <h3>Message Sent!</h3>
              <p>Thank you for reaching out. I'll get back to you as soon as possible.</p>
              <button 
                onClick={() => setSuccess(false)}
                className={styles.button}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <div className={styles.errorMessage}>{error}</div>}
              
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
                />
                {errors.name && <p className={styles.errorText}>{errors.name}</p>}
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
                />
                {errors.email && <p className={styles.errorText}>{errors.email}</p>}
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
                />
                {errors.message && <p className={styles.errorText}>{errors.message}</p>}
              </div>
              
              <button 
                type="submit" 
                className={styles.button}
                disabled={loading}
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