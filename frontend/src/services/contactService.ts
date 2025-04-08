import { ApiService } from './apiService';

/**
 * Contact message interface
 */
export interface IMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Contact form data interface
 */
export interface IContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

/**
 * Contact service
 * Extends the generic ApiService for contact-specific operations
 */
class ContactService extends ApiService<IMessage> {
  constructor() {
    super('/contact');
  }

  /**
   * Send a contact message
   */
  async sendMessage(data: IContactFormData): Promise<IMessage> {
    return this.create(data);
  }

  /**
   * Mark message as read
   */
  async markAsRead(id: string): Promise<IMessage> {
    return this.update(id, { read: true });
  }

  /**
   * Get unread messages
   */
  async getUnreadMessages(): Promise<IMessage[]> {
    try {
      const messages = await this.getAll();
      return messages.filter(msg => !msg.read);
    } catch (error) {
      throw error;
    }
  }
}

export const contactService = new ContactService();