// /frontend/src/pages/AdminProjectsPage.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { useProjects } from '@context/ProjectsContext';
import ProjectsTable from '@features/authentication/components/ProjectsTable';
import ProjectsFilter from '@features/authentication/components/ProjectsFilter';
import LoadingSpinner from '@components/ui/LoadingSpinner';
import styles from '@assets/styles/pages/AdminProjectsPage.module.scss';

/**
 * Admin projects page for managing portfolio projects
 * @returns {JSX.Element} AdminProjectsPage component
 */
const AdminProjectsPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { projects, loading, error, deleteProject } = useProjects();
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    featured: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const navigate = useNavigate();
  
  // Set page title
  useEffect(() => {
    document.title = 'Manage Projects | Admin Dashboard';
  }, []);
  
  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    } else if (!isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);
  
  // Apply filters whenever projects or filters change
  useEffect(() => {
    if (!projects) return;
    
    let result = [...projects];
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(project => 
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        (project.technologies && project.technologies.some(tech => 
          tech.toLowerCase().includes(searchLower)
        )) ||
        (project.tags && project.tags.some(tag => 
          tag.toLowerCase().includes(searchLower)
        ))
      );
    }
    
    // Apply featured filter
    if (filters.featured !== 'all') {
      const isFeatured = filters.featured === 'featured';
      result = result.filter(project => project.featured === isFeatured);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const field = filters.sortBy;
      let aValue = a[field];
      let bValue = b[field];
      
      // Handle dates
      if (field === 'createdAt' || field === 'updatedAt' || field === 'completionDate') {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }
      
      // Handle strings
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return filters.sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      // Handle numbers and dates
      return filters.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
    
    setFilteredProjects(result);
  }, [projects, filters]);
  
  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  // Handle project deletion
  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await deleteProject(projectId);
      } catch (error) {
        console.error('Failed to delete project:', error);
        // Handle error (could show a toast notification here)
      }
    }
  };
  
  // Handle project editing
  const handleEditProject = (projectId) => {
    navigate(`/admin/projects/${projectId}`);
  };
  
  return (
    <div className={styles.adminProjectsPage}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>Manage Projects</h1>
          <p className={styles.subtitle}>View, edit, and organize your portfolio projects</p>
        </div>
        
        <Link to="/admin/projects/new" className={styles.addButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add New Project
        </Link>
      </div>
      
      <div className={styles.filtersContainer}>
        <ProjectsFilter 
          filters={filters} 
          onFilterChange={handleFilterChange} 
        />
      </div>
      
      <div className={styles.projectsContainer}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <LoadingSpinner size="large" />
            <p>Loading projects...</p>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>{error}</p>
            <button className={styles.retryButton}>Retry</button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className={styles.emptyContainer}>
            {filters.search || filters.featured !== 'all' ? (
              <>
                <p className={styles.emptyMessage}>No projects match your filters</p>
                <button 
                  className={styles.resetButton}
                  onClick={() => setFilters({
                    search: '',
                    featured: 'all',
                    sortBy: 'createdAt',
                    sortOrder: 'desc'
                  })}
                >
                  Reset Filters
                </button>
              </>
            ) : (
              <>
                <p className={styles.emptyMessage}>You don't have any projects yet</p>
                <Link to="/admin/projects/new" className={styles.addEmptyButton}>
                  Create Your First Project
                </Link>
              </>
            )}
          </div>
        ) : (
          <ProjectsTable 
            projects={filteredProjects} 
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
          />
        )}
      </div>
    </div>
  );
};

export default AdminProjectsPage;