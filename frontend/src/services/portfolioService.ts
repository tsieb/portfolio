import api from '../lib/axios';
import { formatApiError } from '../utils/api';

/**
 * Social links interface
 */
export interface ISocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  [key: string]: string | undefined;
}

/**
 * Skill interface
 */
export interface ISkill {
  name: string;
  level: number;
}

/**
 * Experience interface
 */
export interface IExperience {
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
}

/**
 * Education interface
 */
export interface IEducation {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

/**
 * Portfolio interface
 */
export interface IPortfolio {
  _id: string;
  owner: {
    name: string;
    title: string;
    bio: string;
    email: string;
    location: string;
    avatar: string;
    social: ISocialLinks;
  };
  skills: ISkill[];
  experience: IExperience[];
  education: IEducation[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Portfolio service
 * Handles API calls related to portfolio data
 */
export const portfolioService = {
  /**
   * Get portfolio data
   */
  async getPortfolio(): Promise<IPortfolio> {
    try {
      const response = await api.get('/portfolio');
      return response.data.data;
    } catch (error) {
      throw new Error(formatApiError(error));
    }
  },

  /**
   * Update portfolio data
   */
  async updatePortfolio(id: string, data: Partial<IPortfolio>): Promise<IPortfolio> {
    try {
      const response = await api.put(`/portfolio/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw new Error(formatApiError(error));
    }
  },

  /**
   * Create portfolio data
   */
  async createPortfolio(data: Omit<IPortfolio, '_id' | 'createdAt' | 'updatedAt'>): Promise<IPortfolio> {
    try {
      const response = await api.post('/portfolio', data);
      return response.data.data;
    } catch (error) {
      throw new Error(formatApiError(error));
    }
  }
};