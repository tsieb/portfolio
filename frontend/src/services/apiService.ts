import api from '../lib/axios';
import { formatApiError } from '../utils/api';

/**
 * Generic API service for common CRUD operations
 */
export class ApiService<T> {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  /**
   * Get all items
   */
  async getAll(params?: Record<string, any>): Promise<T[]> {
    try {
      const response = await api.get(this.endpoint, { params });
      return response.data.data;
    } catch (error) {
      throw new Error(formatApiError(error));
    }
  }

  /**
   * Get item by ID
   */
  async getById(id: string): Promise<T> {
    try {
      const response = await api.get(`${this.endpoint}/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(formatApiError(error));
    }
  }

  /**
   * Create new item
   */
  async create(data: Omit<T, 'id' | '_id'>): Promise<T> {
    try {
      const response = await api.post(this.endpoint, data);
      return response.data.data;
    } catch (error) {
      throw new Error(formatApiError(error));
    }
  }

  /**
   * Update item
   */
  async update(id: string, data: Partial<T>): Promise<T> {
    try {
      const response = await api.put(`${this.endpoint}/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw new Error(formatApiError(error));
    }
  }

  /**
   * Delete item
   */
  async delete(id: string): Promise<void> {
    try {
      await api.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      throw new Error(formatApiError(error));
    }
  }
}