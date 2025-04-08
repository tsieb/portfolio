// /frontend/src/services/projectService.js
import axiosInstance from '@lib/axios';

/**
 * Service for managing projects
 */
const projectService = {
  /**
   * Get all projects
   * @returns {Promise<Array>} Array of projects
   */
  getAllProjects: async () => {
    try {
      const response = await axiosInstance.get('/projects');
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },
  
  /**
   * Get project by ID
   * @param {string} id - Project ID
   * @returns {Promise<Object>} Project data
   */
  getProjectById: async (id) => {
    try {
      const response = await axiosInstance.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Create new project
   * @param {Object} projectData - Project data
   * @returns {Promise<Object>} Created project
   */
  createProject: async (projectData) => {
    try {
      const response = await axiosInstance.post('/projects', projectData);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },
  
  /**
   * Update existing project
   * @param {string} id - Project ID
   * @param {Object} projectData - Updated project data
   * @returns {Promise<Object>} Updated project
   */
  updateProject: async (id, projectData) => {
    try {
      const response = await axiosInstance.put(`/projects/${id}`, projectData);
      return response.data;
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete project
   * @param {string} id - Project ID
   * @returns {Promise<void>}
   */
  deleteProject: async (id) => {
    try {
      await axiosInstance.delete(`/projects/${id}`);
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
      throw error;
    }
  }
};

export default projectService;