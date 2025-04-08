// /frontend/src/services/contactService.js
import axiosInstance from '@lib/axios';

/**
 * Service for handling contact and message functionality
 */
const contactService = {
  /**
   * Send a contact message
   * @param {Object} messageData - Message data
   * @param {string} messageData.name - Sender's name
   * @param {string} messageData.email - Sender's email
   * @param {string} messageData.subject - Message subject
   * @param {string} messageData.message - Message content
   * @returns {Promise<Object>} Response data
   */
  sendMessage: async (messageData) => {
    try {
      const response = await axiosInstance.post('/contact', messageData);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Get error message from response
      const errorMessage = error.response?.data?.message || 
                          'Failed to send message. Please try again later.';
      
      throw new Error(errorMessage);
    }
  },
  
  /**
   * Get all messages (admin only)
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Number of items per page
   * @param {string} params.status - Filter by status
   * @param {string} params.sort - Sort field and direction
   * @returns {Promise<Object>} Response data with pagination
   */
  getMessages: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/contact/messages', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },
  
  /**
   * Get a message by ID (admin only)
   * @param {string} id - Message ID
   * @returns {Promise<Object>} Message data
   */
  getMessageById: async (id) => {
    try {
      const response = await axiosInstance.get(`/contact/messages/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching message ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Update message status (admin only)
   * @param {string} id - Message ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated message
   */
  updateMessageStatus: async (id, status) => {
    try {
      const response = await axiosInstance.put(`/contact/messages/${id}`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating message ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a message (admin only)
   * @param {string} id - Message ID
   * @returns {Promise<void>}
   */
  deleteMessage: async (id) => {
    try {
      await axiosInstance.delete(`/contact/messages/${id}`);
    } catch (error) {
      console.error(`Error deleting message ${id}:`, error);
      throw error;
    }
  }
};

export default contactService;