// /frontend/src/features/project/components/RelatedProjects.jsx
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTheme } from '@context/ThemeContext';
import styles from '@assets/styles/features/project/RelatedProjects.module.scss';

/**
 * Related projects component showing similar projects
 * @param {Object} props - Component props
 * @param {Array} props.projects - Array of related project objects
 * @returns {JSX.Element} RelatedProjects component
 */
const RelatedProjects = ({ projects }) => {
  const { isDarkMode } = useTheme();
  
  // Skip rendering if no related projects
  if (!projects || projects.length === 0) {
    return null;
  }
  
  return (
    <div className={`${styles.relatedProjects} ${isDarkMode ? styles.dark : ''}`}>
      <div className={styles.projectsGrid}>
        {projects.map((project) => (
          <Link 
            key={project.id} 
            to={`/projects/${project.id}`}
            className={styles.projectCard}
          >
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
            
            <div className={styles.projectInfo}>
              <h3 className={styles.projectTitle}>{project.title}</h3>
              <p className={styles.projectDescription}>{project.description}</p>
              
              {project.technologies && project.technologies.length > 0 && (
                <div className={styles.technologies}>
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <span key={index} className={styles.technology}>
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className={styles.moreTech}>
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
              )}
              
              <div className={styles.viewProject}>
                <span>View Project</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

RelatedProjects.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      technologies: PropTypes.arrayOf(PropTypes.string),
      imageUrl: PropTypes.string,
      color: PropTypes.string
    })
  ).isRequired
};

export default RelatedProjects;