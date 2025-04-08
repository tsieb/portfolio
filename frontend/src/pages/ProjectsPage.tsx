import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectService, IProject } from '../services/projectService';
import styles from './ProjectsPage.module.scss';

/**
 * Projects page component
 * Displays a grid of all portfolio projects
 */
const ProjectsPage = () => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectService.getProjects();
        setProjects(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className={styles.projectsPage}>
      <h1 className={styles.title}>Projects</h1>
      <p className={styles.subtitle}>
        Explore my portfolio of projects, showcasing my skills and experience in web development.
      </p>

      {loading && (
        <div className={styles.loading}>
          <p>Loading projects...</p>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className={styles.projectsGrid}>
          {projects.map((project) => (
            <div key={project.id} className={styles.projectCard}>
              <div 
                className={styles.projectImage}
                style={{ backgroundImage: `url(${project.image})` }}
              ></div>
              <div className={styles.projectContent}>
                <h2 className={styles.projectTitle}>{project.title}</h2>
                <p className={styles.projectDescription}>{project.description}</p>
                <div className={styles.projectTech}>
                  {project.technologies.map((tech, index) => (
                    <span key={index} className={styles.techTag}>
                      {tech}
                    </span>
                  ))}
                </div>
                <div className={styles.projectLinks}>
                  <Link to={`/projects/${project.id}`} className={styles.detailsLink}>
                    View Details
                  </Link>
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.externalLink}
                  >
                    GitHub
                  </a>
                  <a 
                    href={project.liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.externalLink}
                  >
                    Live Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className={styles.noProjects}>
          <p>No projects found. Check back later!</p>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;