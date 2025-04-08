import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { projectService, IProject } from '../services/projectService';
import styles from './ProjectDetailPage.module.scss';

/**
 * Project detail page component
 * Displays detailed information about a specific project
 */
const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await projectService.getProjectById(id);
        setProject(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project. It may not exist or has been removed.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Loading project details...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className={styles.error}>
        <p>{error || 'Project not found'}</p>
        <button 
          onClick={() => navigate('/projects')}
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
          ></div>
          
          <div className={styles.description}>
            <h2 className={styles.sectionTitle}>Project Overview</h2>
            <p>{project.description}</p>
          </div>
          
          <div className={styles.technicalDetails}>
            <h2 className={styles.sectionTitle}>Technical Details</h2>
            <p>
              This section would include more detailed information about the project, 
              including architecture decisions, challenges overcome, and specific 
              technical implementations.
            </p>
          </div>
          
          <div className={styles.features}>
            <h2 className={styles.sectionTitle}>Key Features</h2>
            <ul className={styles.featureList}>
              <li>Feature 1: Description of the feature and its implementation</li>
              <li>Feature 2: Description of the feature and its implementation</li>
              <li>Feature 3: Description of the feature and its implementation</li>
              <li>Feature 4: Description of the feature and its implementation</li>
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
            <h3 className={styles.sidebarTitle}>Timeline</h3>
            <p className={styles.timeline}>
              January 2023 - March 2023
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;