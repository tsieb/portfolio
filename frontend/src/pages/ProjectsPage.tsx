import { useState } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { useQuery } from '../hooks/useQuery';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import styles from './ProjectsPage.module.scss';

/**
 * Projects page component
 * Displays a grid of all portfolio projects
 */
const ProjectsPage = () => {
  const [filter, setFilter] = useState<string>('all');
  
  const { data: projects, isLoading, error, refetch } = useQuery(
    'projects',
    projectService.getAll.bind(projectService)
  );

  // Filter projects by technology
  const filteredProjects = filter === 'all'
    ? projects
    : projects?.filter(project => 
        project.technologies.some(tech => 
          tech.toLowerCase() === filter.toLowerCase()
        )
      );

  // Get unique technologies from all projects
  const technologies = projects
    ? [...new Set(projects.flatMap(project => project.technologies))]
    : [];

  return (
    <div className={styles.projectsPage}>
      <h1 className={styles.title}>Projects</h1>
      <p className={styles.subtitle}>
        Explore my portfolio of projects, showcasing my skills and experience in web development.
      </p>

      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage 
          message={error} 
          retryFn={refetch} 
        />
      ) : (
        <>
          <div className={styles.filters}>
            <button 
              className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            {technologies.map(tech => (
              <button 
                key={tech}
                className={`${styles.filterButton} ${filter === tech ? styles.active : ''}`}
                onClick={() => setFilter(tech)}
              >
                {tech}
              </button>
            ))}
          </div>

          {filteredProjects?.length ? (
            <div className={styles.projectsGrid}>
              {filteredProjects.map((project) => (
                <div key={project._id} className={styles.projectCard}>
                  <div 
                    className={styles.projectImage}
                    style={{ backgroundImage: `url(${project.image})` }}
                    aria-hidden="true"
                  />
                  <div className={styles.projectContent}>
                    <h2 className={styles.projectTitle}>{project.title}</h2>
                    <p className={styles.projectDescription}>{project.description}</p>
                    <div className={styles.projectTech}>
                      {project.technologies.map((tech, index) => (
                        <span key={`${project._id}-${tech}-${index}`} className={styles.techTag}>
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className={styles.projectLinks}>
                      <Link to={`/projects/${project._id}`} className={styles.detailsLink}>
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
          ) : (
            <div className={styles.noProjects}>
              <p>No projects found with the selected filter. Try another category or check back later!</p>
              {filter !== 'all' && (
                <button 
                  onClick={() => setFilter('all')}
                  className={styles.clearFilterButton}
                >
                  Clear Filter
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectsPage;