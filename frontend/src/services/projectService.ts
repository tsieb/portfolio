import { ApiService } from './apiService';

/**
 * Project interface
 */
export interface IProject {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Project service
 * Extends the generic ApiService for project-specific operations
 */
class ProjectService extends ApiService<IProject> {
  constructor() {
    super('/projects');
  }

  /**
   * Get featured projects
   */
  async getFeaturedProjects(): Promise<IProject[]> {
    return this.getAll({ featured: true });
  }
}

export const projectService = new ProjectService();