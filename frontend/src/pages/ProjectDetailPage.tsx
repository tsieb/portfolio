import { useParams, Link, useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { useQuery } from '../hooks/useQuery';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import styles from './ProjectDetailPage.module.scss';

/**
 * Project detail page component
 * Displays detailed information about a specific project
 */
const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: project, isLoading, error, refetch } = useQuery(
    `project-${id}`,
    () => projectService.getById(id as string),
    [id]
  );

  // Go back to projects list
  const handleBackClick = () => {
    navigate('/projects');
  };

  if (isLoading) {
    return <LoadingSpinner fullPage />;
  }

  if (error || !project) {
    return (
      <div className={styles.error}>
        <ErrorMessage 
          message={error || 'Project not found'} 
          retryFn={refetch} 
        />
        <button 
          onClick={handleBackClick}
          className={styles.backButton}
        >
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className={styles.projectDetailPage}>
      <div className={styles.header}>
        <Link to="/projects" className={styles.backLink}>
          &larr; Back to Projects
        </Link>
        <h1 className={styles.title}>{project.title}</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.mainContent}>
          <div 
            className={styles.projectImage}
            style={{ backgroundImage: `url(${project.image})` }}
            aria-hidden="true"
          ></div>
          
          <div className={styles.description}>
            <h2 className={styles.sectionTitle}>Project Overview</h2>
            <p>{project.description}</p>
          </div>
          
          <div className={styles.technicalDetails}>
            <h2 className={styles.sectionTitle}>Technical Details</h2>
            <p>
              This project was built using {project.technologies.join(', ')}.
            </p>
            <p>
              The project required careful planning and implementation to ensure optimal performance and user experience.
            </p>
          </div>
          
          <div className={styles.features}>
            <h2 className={styles.sectionTitle}>Key Features</h2>
            <ul className={styles.featureList}>
              <li>Responsive design that works on all devices</li>
              <li>Optimized performance for fast loading</li>
              <li>Accessible interfaces following WCAG guidelines</li>
              <li>Comprehensive testing for reliability</li>
            </ul>
          </div>
        </div>
        
        <div className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Project Links</h3>
            <div className={styles.links}>
              <a 
                href={project.liveUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.primaryLink}
              >
                Live Demo
              </a>
              <a 
                href={project.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.secondaryLink}
              >
                GitHub Repository
              </a>
            </div>
          </div>
          
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Technologies</h3>
            <div className={styles.technologies}>
              {project.technologies.map((tech, index) => (
                <span key={index} className={styles.techTag}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
          
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Created</h3>
            <p className={styles.timeline}>
              {new Date(project.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;