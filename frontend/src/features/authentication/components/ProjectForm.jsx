// /frontend/src/features/authentication/components/ProjectForm.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@context/ThemeContext';
import LoadingSpinner from '@components/ui/LoadingSpinner';
import styles from '@assets/styles/features/authentication/ProjectForm.module.scss';

/**
 * Project form component for creating and editing projects
 * @param {Object} props - Component props
 * @param {Object|null} props.project - Project data for editing, null for new project
 * @param {Function} props.onSubmit - Form submission handler
 * @param {Function} props.onCancel - Cancel button handler
 * @param {boolean} props.isSubmitting - Whether form is currently submitting
 * @returns {JSX.Element} ProjectForm component
 */
const ProjectForm = ({ project, onSubmit, onCancel, isSubmitting }) => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fullDescription: '',
    technologies: [],
    tags: [],
    imageUrl: '',
    demoUrl: '',
    sourceUrl: '',
    featured: false,
    color: '#5d8eff'
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  // Initialize form with project data if editing
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        fullDescription: project.fullDescription || '',
        technologies: project.technologies || [],
        tags: project.tags || [],
        imageUrl: project.imageUrl || '',
        demoUrl: project.demoUrl || '',
        sourceUrl: project.sourceUrl || '',
        featured: project.featured || false,
        color: project.color || '#5d8eff'
      });
    }
  }, [project]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear errors on change
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Handle array input changes (technologies, tags)
  const handleArrayChange = (e, fieldName) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [fieldName]: value.split(',').map(item => item.trim()).filter(Boolean)
    }));
  };
  
  // Handle field blur for validation
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    validateField(name, formData[name]);
  };
  
  // Validate a single field
  const validateField = (name, value) => {
    let error = null;
    
    switch (name) {
      case 'title':
        if (!value.trim()) {
          error = 'Title is required';
        } else if (value.length > 100) {
          error = 'Title must be less than 100 characters';
        }
        break;
      
      case 'description':
        if (!value.trim()) {
          error = 'Description is required';
        } else if (value.length > 500) {
          error = 'Description must be less than 500 characters';
        }
        break;
      
      case 'imageUrl':
        if (value && !/^(https?:\/\/|\/)/i.test(value)) {
          error = 'Image URL must be a valid URL or path';
        }
        break;
      
      case 'demoUrl':
        if (value && !/^https?:\/\//i.test(value)) {
          error = 'Demo URL must be a valid URL starting with http:// or https://';
        }
        break;
      
      case 'sourceUrl':
        if (value && !/^https?:\/\//i.test(value)) {
          error = 'Source URL must be a valid URL starting with http:// or https://';
        }
        break;
      
      default:
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    return !error;
  };
  
  // Validate all fields before submission
  const validateForm = () => {
    const fields = ['title', 'description', 'imageUrl', 'demoUrl', 'sourceUrl'];
    let isValid = true;
    
    fields.forEach(field => {
      const fieldIsValid = validateField(field, formData[field]);
      isValid = isValid && fieldIsValid;
    });
    
    // Mark all fields as touched
    const allTouched = fields.reduce((acc, field) => ({
      ...acc,
      [field]: true
    }), {});
    
    setTouched(prev => ({
      ...prev,
      ...allTouched
    }));
    
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSubmit(formData);
  };
  
  return (
    <form className={`${styles.projectForm} ${isDarkMode ? styles.dark : ''}`} onSubmit={handleSubmit}>
      <div className={styles.formGrid}>
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label htmlFor="title" className={styles.label}>
            Project Title <span className={styles.required}>*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className={`${styles.input} ${errors.title && touched.title ? styles.inputError : ''}`}
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter project title"
            disabled={isSubmitting}
            maxLength={100}
          />
          {errors.title && touched.title && (
            <p className={styles.errorText}>{errors.title}</p>
          )}
        </div>
        
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label htmlFor="description" className={styles.label}>
            Short Description <span className={styles.required}>*</span>
          </label>
          <textarea
            id="description"
            name="description"
            className={`${styles.textarea} ${errors.description && touched.description ? styles.inputError : ''}`}
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter a brief description (max 500 characters)"
            disabled={isSubmitting}
            rows={3}
            maxLength={500}
          ></textarea>
          <p className={styles.counter}>{formData.description.length}/500</p>
          {errors.description && touched.description && (
            <p className={styles.errorText}>{errors.description}</p>
          )}
        </div>
        
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label htmlFor="fullDescription" className={styles.label}>
            Full Description
          </label>
          <textarea
            id="fullDescription"
            name="fullDescription"
            className={styles.textarea}
            value={formData.fullDescription}
            onChange={handleChange}
            placeholder="Enter detailed project description (supports markdown)"
            disabled={isSubmitting}
            rows={8}
          ></textarea>
          <p className={styles.helperText}>
            You can use Markdown for formatting. Separate paragraphs with blank lines.
          </p>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="technologies" className={styles.label}>
            Technologies
          </label>
          <input
            id="technologies"
            name="technologies"
            type="text"
            className={styles.input}
            value={formData.technologies.join(', ')}
            onChange={(e) => handleArrayChange(e, 'technologies')}
            placeholder="React, Node.js, MongoDB"
            disabled={isSubmitting}
          />
          <p className={styles.helperText}>
            Comma-separated list of technologies used
          </p>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="tags" className={styles.label}>
            Tags
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            className={styles.input}
            value={formData.tags.join(', ')}
            onChange={(e) => handleArrayChange(e, 'tags')}
            placeholder="Frontend, Backend, Full Stack"
            disabled={isSubmitting}
          />
          <p className={styles.helperText}>
            Comma-separated list of project categories
          </p>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="imageUrl" className={styles.label}>
            Image URL
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="text"
            className={`${styles.input} ${errors.imageUrl && touched.imageUrl ? styles.inputError : ''}`}
            value={formData.imageUrl}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="https://example.com/image.jpg"
            disabled={isSubmitting}
          />
          {errors.imageUrl && touched.imageUrl && (
            <p className={styles.errorText}>{errors.imageUrl}</p>
          )}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="color" className={styles.label}>
            Theme Color
          </label>
          <div className={styles.colorPickerWrapper}>
            <input
              id="color"
              name="color"
              type="color"
              className={styles.colorPicker}
              value={formData.color}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <input
              type="text"
              className={styles.colorText}
              value={formData.color}
              onChange={(e) => handleChange({ target: { name: 'color', value: e.target.value } })}
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="demoUrl" className={styles.label}>
            Demo URL
          </label>
          <input
            id="demoUrl"
            name="demoUrl"
            type="text"
            className={`${styles.input} ${errors.demoUrl && touched.demoUrl ? styles.inputError : ''}`}
            value={formData.demoUrl}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="https://demo.example.com"
            disabled={isSubmitting}
          />
          {errors.demoUrl && touched.demoUrl && (
            <p className={styles.errorText}>{errors.demoUrl}</p>
          )}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="sourceUrl" className={styles.label}>
            Source URL
          </label>
          <input
            id="sourceUrl"
            name="sourceUrl"
            type="text"
            className={`${styles.input} ${errors.sourceUrl && touched.sourceUrl ? styles.inputError : ''}`}
            value={formData.sourceUrl}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="https://github.com/username/repo"
            disabled={isSubmitting}
          />
          {errors.sourceUrl && touched.sourceUrl && (
            <p className={styles.errorText}>{errors.sourceUrl}</p>
          )}
        </div>
        
        <div className={styles.formGroup}>
          <div className={styles.checkboxContainer}>
            <input
              id="featured"
              name="featured"
              type="checkbox"
              className={styles.checkbox}
              checked={formData.featured}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <label htmlFor="featured" className={styles.checkboxLabel}>
              Featured Project
            </label>
          </div>
          <p className={styles.helperText}>
            Featured projects appear on the homepage and are highlighted in the portfolio
          </p>
        </div>
      </div>
      
      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="small" color="white" />
              {project ? 'Saving...' : 'Creating...'}
            </>
          ) : (
            project ? 'Save Changes' : 'Create Project'
          )}
        </button>
      </div>
    </form>
  );
};

ProjectForm.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    fullDescription: PropTypes.string,
    technologies: PropTypes.arrayOf(PropTypes.string),
    tags: PropTypes.arrayOf(PropTypes.string),
    imageUrl: PropTypes.string,
    demoUrl: PropTypes.string,
    sourceUrl: PropTypes.string,
    featured: PropTypes.bool,
    color: PropTypes.string
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool
};

ProjectForm.defaultProps = {
  project: null,
  isSubmitting: false
};

export default ProjectForm;