// /frontend/src/pages/AdminProjectEditPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { useProjects } from '@context/ProjectsContext';
import ProjectForm from '@features/authentication/components/ProjectForm';
import LoadingSpinner from '@components/ui/LoadingSpinner';
import styles from '@assets/styles/pages/AdminProjectEditPage.module.scss';

/**
 * Admin project edit page for creating or updating projects
 * @returns {JSX.Element} AdminProjectEditPage component
 */
const AdminProjectEditPage = () => {
  const { projectId } = useParams();
  const { isAuthenticated, isAdmin } = useAuth();
  const { projects, loading, error, getProjectById, addProject, updateProject } = useProjects();
  const [project, setProject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigate();
  
  const isNewProject = projectId === 'new';
  
  // Set page title
  useEffect(() => {
    document.title = isNewProject 
      ? 'Create New Project | Admin Dashboard' 
      : 'Edit Project | Admin Dashboard';
  }, [isNewProject]);
  
  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    } else if (!isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);
  
  // Load project data if editing existing project
  useEffect(() => {
    if (!isNewProject && projectId) {
      const currentProject = getProjectById(projectId);
      
      if (currentProject) {
        setProject(currentProject);
      } else if (!loading && projects.length > 0) {
        // Project not found, redirect to projects page
        navigate('/admin/projects');
      }
    }
  }, [isNewProject, projectId, projects, getProjectById, loading, navigate]);
  
  // Handle form submission for creating or updating a project
  const handleSubmit = async (projectData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      if (isNewProject) {
        // Create new project
        await addProject(projectData);
        navigate('/admin/projects');
      } else {
        // Update existing project
        await updateProject(projectId, projectData);
        navigate('/admin/projects');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      setSubmitError(error.message || 'Failed to save project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle cancel button click
  const handleCancel = () => {
    navigate('/admin/projects');
  };
  
  // Show loading spinner while loading project data
  if (!isNewProject && loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" />
        <p>Loading project data...</p>
      </div>
    );
  }
  
  // Show error message if project loading fails
  if (!isNewProject && error) {
    return (
      <div className={styles.errorContainer}>
        <h2 className={styles.errorTitle}>Error Loading Project</h2>
        <p className={styles.errorMessage}>{error}</p>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/admin/projects')}
        >
          Back to Projects
        </button>
      </div>
    );
  }
  
  return (
    <div className={styles.adminProjectEditPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {isNewProject ? 'Create New Project' : `Edit Project: ${project?.title}`}
        </h1>
        <p className={styles.subtitle}>
          {isNewProject 
            ? 'Add a new project to your portfolio' 
            : 'Update your existing project information'}
        </p>
      </div>
      
      <div className={styles.formContainer}>
        {submitError && (
          <div className={styles.errorMessage}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{submitError}</span>
          </div>
        )}
        
        <ProjectForm 
          project={isNewProject ? null : project}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default AdminProjectEditPage;