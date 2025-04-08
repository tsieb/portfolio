// /frontend/src/features/authentication/components/ProjectsTable.jsx
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTheme } from '@context/ThemeContext';
import styles from '@assets/styles/features/authentication/ProjectsTable.module.scss';

/**
 * Projects table component for admin dashboard
 * @param {Object} props - Component props
 * @param {Array} props.projects - Array of project objects
 * @param {Function} props.onEdit - Function to handle edit action
 * @param {Function} props.onDelete - Function to handle delete action
 * @returns {JSX.Element} ProjectsTable component
 */
const ProjectsTable = ({ projects, onEdit, onDelete }) => {
  const { isDarkMode } = useTheme();
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className={`${styles.projectsTable} ${isDarkMode ? styles.dark : ''}`}>
      <div className={styles.tableHeader}>
        <div className={styles.headerProject}>Project</div>
        <div className={styles.headerStatus}>Status</div>
        <div className={styles.headerDate}>Created</div>
        <div className={styles.headerActions}>Actions</div>
      </div>
      
      <div className={styles.tableBody}>
        {projects.map((project) => (
          <div key={project.id} className={styles.tableRow}>
            <div className={styles.cellProject}>
              <div className={styles.projectImageWrapper}>
                <div 
                  className={styles.projectImage} 
                  style={{ 
                    backgroundColor: project.color,
                    backgroundImage: project.imageUrl ? `url(${project.imageUrl})` : undefined
                  }}
                >
                  {!project.imageUrl && (
                    <div className={styles.projectInitial}>
                      {project.title.charAt(0)}
                    </div>
                  )}
                </div>
              </div>
              
              <div className={styles.projectInfo}>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectDescription}>{project.description}</p>
                
                {project.technologies && project.technologies.length > 0 && (
                  <div className={styles.projectTags}>
                    {project.technologies.slice(0, 3).map((tech, index) => (
                      <span key={index} className={styles.tag}>{tech}</span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className={styles.moreTag}>+{project.technologies.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className={styles.cellStatus}>
              {project.featured ? (
                <span className={`${styles.statusBadge} ${styles.featured}`}>Featured</span>
              ) : (
                <span className={`${styles.statusBadge} ${styles.standard}`}>Standard</span>
              )}
            </div>
            
            <div className={styles.cellDate}>
              {formatDate(project.createdAt)}
            </div>
            
            <div className={styles.cellActions}>
              <div className={styles.actionButtons}>
                <button 
                  className={styles.editButton}
                  onClick={() => onEdit(project.id)}
                  aria-label={`Edit ${project.title}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  <span>Edit</span>
                </button>
                
                <Link 
                  to={`/projects/${project.id}`} 
                  className={styles.viewButton}
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={`View ${project.title}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span>View</span>
                </Link>
                
                <button 
                  className={styles.deleteButton}
                  onClick={() => onDelete(project.id)}
                  aria-label={`Delete ${project.title}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ProjectsTable.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      featured: PropTypes.bool,
      createdAt: PropTypes.string,
      technologies: PropTypes.arrayOf(PropTypes.string),
      imageUrl: PropTypes.string,
      color: PropTypes.string
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default ProjectsTable;