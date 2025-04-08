// /frontend/src/pages/ProjectPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '@context/ProjectsContext';
import ProjectHeader from '@features/project/components/ProjectHeader';
import ProjectDetails from '@features/project/components/ProjectDetails';
import ProjectTechnologies from '@features/project/components/ProjectTechnologies';
import ProjectGallery from '@features/project/components/ProjectGallery';
import RelatedProjects from '@features/project/components/RelatedProjects';
import LoadingSpinner from '@components/ui/LoadingSpinner';
import styles from '@assets/styles/pages/ProjectPage.module.scss';

/**
 * Project page component for displaying a single project
 * @returns {JSX.Element} ProjectPage component
 */
const ProjectPage = () => {
  const { projectId } = useParams();
  const { projects, getProjectById, loading, error } = useProjects();
  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const navigate = useNavigate();
  
  // Set page title and fetch project data
  useEffect(() => {
    if (projectId) {
      const currentProject = getProjectById(projectId);
      
      if (currentProject) {
        setProject(currentProject);
        document.title = `${currentProject.title} | Space Portfolio`;
        
        // Find related projects based on tags or technologies
        if (projects.length > 0) {
          const related = projects
            .filter(p => p.id !== projectId) // Exclude current project
            .filter(p => {
              // Check for shared tags or technologies
              const sharedTags = p.tags?.some(tag => 
                currentProject.tags?.includes(tag)
              );
              const sharedTech = p.technologies?.some(tech => 
                currentProject.technologies?.includes(tech)
              );
              return sharedTags || sharedTech;
            })
            .slice(0, 3); // Limit to 3 related projects
          
          setRelatedProjects(related);
        }
      } else if (!loading && projects.length > 0) {
        // If project not found and projects are loaded, redirect to 404
        navigate('/not-found');
      }
    }
  }, [projectId, projects, getProjectById, loading, navigate]);
  
  // Loading state
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" />
        <p>Loading project...</p>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2 className={styles.errorTitle}>Error Loading Project</h2>
        <p className={styles.errorMessage}>{error}</p>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>
    );
  }
  
  // No project found
  if (!project && !loading) {
    return (
      <div className={styles.notFoundContainer}>
        <h2 className={styles.notFoundTitle}>Project Not Found</h2>
        <p className={styles.notFoundMessage}>
          The project you're looking for doesn't exist or has been removed.
        </p>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>
    );
  }
  
  return (
    <div className={styles.projectPage}>
      {project && (
        <>
          <ProjectHeader project={project} />
          
          <div className={styles.content}>
            <div className={styles.mainContent}>
              <ProjectDetails project={project} />
              <ProjectTechnologies technologies={project.technologies} />
              {project.imageUrl && <ProjectGallery project={project} />}
            </div>
            
            <aside className={styles.sidebar}>
              <div className={styles.projectActions}>
                {project.demoUrl && (
                  <a 
                    href={project.demoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.demoButton}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    View Live Demo
                  </a>
                )}
                
                {project.sourceUrl && (
                  <a 
                    href={project.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.sourceButton}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                    View Source Code
                  </a>
                )}
              </div>
              
              <div className={styles.projectMeta}>
                {project.completionDate && (
                  <div className={styles.metaItem}>
                    <h3 className={styles.metaTitle}>Completed</h3>
                    <p className={styles.metaValue}>
                      {new Date(project.completionDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </p>
                  </div>
                )}
                
                {project.tags && project.tags.length > 0 && (
                  <div className={styles.metaItem}>
                    <h3 className={styles.metaTitle}>Categories</h3>
                    <div className={styles.tagsList}>
                      {project.tags.map((tag, index) => (
                        <span key={index} className={styles.tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
          
          {relatedProjects.length > 0 && (
            <div className={styles.relatedSection}>
              <h2 className={styles.relatedTitle}>Related Projects</h2>
              <RelatedProjects projects={relatedProjects} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectPage;