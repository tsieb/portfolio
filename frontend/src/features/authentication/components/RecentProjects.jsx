// /frontend/src/features/authentication/components/RecentProjects.jsx
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTheme } from '@context/ThemeContext';
import LoadingSpinner from '@components/ui/LoadingSpinner';
import styles from '@assets/styles/features/authentication/RecentProjects.module.scss';

/**
 * Recent projects component for admin dashboard
 * @param {Object} props - Component props
 * @param {Array} props.projects - Array of project objects
 * @param {boolean} props.loading - Whether projects are loading
 * @param {string|null} props.error - Error message if any
 * @returns {JSX.Element} RecentProjects component
 */
const RecentProjects = ({ projects, loading, error }) => {
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
  
  // Get project status indicator
  const getStatusIndicator = (project) => {
    if (project.featured) {
      return <span className={`${styles.statusBadge} ${styles.featured}`}>Featured</span>;
    }
    return null;
  };
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="medium" />
        <p>Loading projects...</p>
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
  
  if (projects.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <p className={styles.emptyMessage}>No projects found</p>
        <Link to="/admin/projects/new" className={styles.addButton}>
          Add Your First Project
        </Link>
      </div>
    );
  }
  
  return (
    <div className={`${styles.recentProjects} ${isDarkMode ? styles.dark : ''}`}>
      <div className={styles.projectsList}>
        {projects.map((project) => (
          <div key={project.id} className={styles.projectItem}>
            <div className={styles.projectImageWrapper}>
              <div 
                className={styles.projectImage} 
                style={{ 
                  backgroundColor: project.color,
                  backgroundImage: project.imageUrl ? `url(${project.imageUrl})` : undefined
                }}
              >
                {!project.imageUrl && (
                  <div className={styles.placeholderIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                      <polyline points="2 17 12 22 22 17"></polyline>
                      <polyline points="2 12 12 17 22 12"></polyline>
                    </svg>
                  </div>
                )}
              </div>
            </div>
            
            <div className={styles.projectContent}>
              <div className={styles.projectHeader}>
                <h3 className={styles.projectTitle}>
                  {project.title}
                </h3>
                {getStatusIndicator(project)}
              </div>
              
              <p className={styles.projectDescription}>
                {project.description}
              </p>
              
              <div className={styles.projectMeta}>
                <span className={styles.projectDate}>
                  Created: {formatDate(project.createdAt)}
                </span>
                
                <div className={styles.projectTags}>
                  {project.technologies?.slice(0, 2).map((tech, index) => (
                    <span key={index} className={styles.tag}>{tech}</span>
                  ))}
                  {project.technologies?.length > 2 && (
                    <span className={styles.moreTag}>+{project.technologies.length - 2}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className={styles.projectActions}>
              <Link to={`/admin/projects/${project.id}`} className={styles.editButton}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                <span>Edit</span>
              </Link>
              
              <Link to={`/projects/${project.id}`} className={styles.viewButton} target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span>View</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.viewAllContainer}>
        <Link to="/admin/projects" className={styles.viewAllButton}>
          View All Projects
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </Link>
      </div>
    </div>
  );
};

RecentProjects.propTypes = {
  projects: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string
};

RecentProjects.defaultProps = {
  loading: false,
  error: null
};

export default RecentProjects;