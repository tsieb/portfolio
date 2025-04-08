// /frontend/src/features/project/components/ProjectGallery.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@context/ThemeContext';
import styles from '@assets/styles/features/project/ProjectGallery.module.scss';

/**
 * Project gallery component for showing project images
 * @param {Object} props - Component props
 * @param {Object} props.project - Project data object with images
 * @returns {JSX.Element} ProjectGallery component
 */
const ProjectGallery = ({ project }) => {
  const { isDarkMode } = useTheme();
  const [activeImage, setActiveImage] = useState(0);
  
  // Handle missing images
  if (!project.imageUrl && (!project.gallery || project.gallery.length === 0)) {
    return null;
  }
  
  // Combine main image with gallery if it exists
  const images = project.gallery 
    ? [project.imageUrl, ...project.gallery]
    : [project.imageUrl];
  
  // Navigate between images
  const handlePrev = () => {
    setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  // Handle thumbnail click
  const handleThumbnailClick = (index) => {
    setActiveImage(index);
  };
  
  return (
    <section className={`${styles.projectGallery} ${isDarkMode ? styles.dark : ''}`}>
      <h2 className={styles.sectionTitle}>Project Gallery</h2>
      
      <div className={styles.galleryContainer}>
        <div className={styles.mainImageContainer}>
          <button 
            className={`${styles.navButton} ${styles.prevButton}`}
            onClick={handlePrev}
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          
          <div className={styles.mainImage}>
            <img 
              src={images[activeImage]} 
              alt={`${project.title} - Image ${activeImage + 1}`} 
            />
          </div>
          
          <button 
            className={`${styles.navButton} ${styles.nextButton}`}
            onClick={handleNext}
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        
        {images.length > 1 && (
          <div className={styles.thumbnails}>
            {images.map((image, index) => (
              <button
                key={index}
                className={`${styles.thumbnail} ${index === activeImage ? styles.active : ''}`}
                onClick={() => handleThumbnailClick(index)}
                aria-label={`View image ${index + 1}`}
              >
                <img 
                  src={image} 
                  alt={`${project.title} - Thumbnail ${index + 1}`} 
                />
              </button>
            ))}
          </div>
        )}
        
        <div className={styles.imageCounter}>
          {activeImage + 1} / {images.length}
        </div>
      </div>
    </section>
  );
};

ProjectGallery.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    gallery: PropTypes.arrayOf(PropTypes.string)
  }).isRequired
};

export default ProjectGallery;