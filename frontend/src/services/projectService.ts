import api from '../lib/axios';

/**
 * Project interface
 */
export interface IProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  githubUrl: string;
  liveUrl: string;
}

/**
 * Project service
 * Handles API calls related to projects
 */
export const projectService = {
  /**
   * Get all projects
   */
  async getProjects(): Promise<IProject[]> {
    const response = await api.get('/projects');
    return response.data.data;
  },
  
  /**
   * Get project by ID
   */
  async getProjectById(id: string): Promise<IProject> {
    const response = await api.get(`/projects/${id}`);
    return response.data.data;
  },
  
  /**
   * Create new project
   */
  async createProject(project: Omit<IProject, 'id'>): Promise<IProject> {
    const response = await api.post('/projects', project);
    return response.data.data;
  },
  
  /**
   * Update project
   */
  async updateProject(id: string, project: Partial<IProject>): Promise<IProject> {
    const response = await api.put(`/projects/${id}`, project);
    return response.data.data;
  },
  
  /**
   * Delete project
   */
  async deleteProject(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
  },
};