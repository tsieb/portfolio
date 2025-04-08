// /frontend/src/context/ProjectsContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import projectService from '@services/projectService';

const ProjectsContext = createContext();

/**
 * Provider component for projects context
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} ProjectsProvider component
 */
export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectService.getAllProjects();
        setProjects(data);
        setFeaturedProjects(data.filter(project => project.featured));
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  /**
   * Get project by ID
   * @param {string} id - Project ID
   * @returns {Object|null} Project object or null if not found
   */
  const getProjectById = (id) => {
    return projects.find(project => project.id === id) || null;
  };

  /**
   * Add new project
   * @param {Object} project - Project data
   * @returns {Promise<Object>} Added project
   */
  const addProject = async (project) => {
    try {
      setLoading(true);
      const newProject = await projectService.createProject(project);
      setProjects(prevProjects => [...prevProjects, newProject]);
      if (newProject.featured) {
        setFeaturedProjects(prevFeatured => [...prevFeatured, newProject]);
      }
      return newProject;
    } catch (err) {
      setError(err.message || 'Failed to add project');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update existing project
   * @param {string} id - Project ID
   * @param {Object} updatedData - Updated project data
   * @returns {Promise<Object>} Updated project
   */
  const updateProject = async (id, updatedData) => {
    try {
      setLoading(true);
      const updatedProject = await projectService.updateProject(id, updatedData);
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project.id === id ? updatedProject : project
        )
      );
      setFeaturedProjects(prevFeatured => {
        // If project was featured or is now featured, update featured list
        if (updatedData.featured !== undefined) {
          if (updatedData.featured) {
            if (!prevFeatured.some(p => p.id === id)) {
              return [...prevFeatured, updatedProject];
            }
          } else {
            return prevFeatured.filter(p => p.id !== id);
          }
        }
        return prevFeatured.map(project => 
          project.id === id ? updatedProject : project
        );
      });
      return updatedProject;
    } catch (err) {
      setError(err.message || 'Failed to update project');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete project
   * @param {string} id - Project ID
   * @returns {Promise<void>}
   */
  const deleteProject = async (id) => {
    try {
      setLoading(true);
      await projectService.deleteProject(id);
      setProjects(prevProjects => prevProjects.filter(project => project.id !== id));
      setFeaturedProjects(prevFeatured => prevFeatured.filter(project => project.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete project');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    projects,
    featuredProjects,
    loading,
    error,
    getProjectById,
    addProject,
    updateProject,
    deleteProject
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};

ProjectsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook for accessing projects context
 * @returns {Object} Projects context value
 */
export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};