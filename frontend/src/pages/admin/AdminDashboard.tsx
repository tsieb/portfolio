import { useState } from 'react';
import { projectService } from '../../services/projectService';
import { contactService } from '../../services/contactService';
import { useQuery } from '../../hooks/useQuery';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import styles from './AdminDashboard.module.scss';

/**
 * Admin dashboard page component
 * Displays projects and messages for management
 */
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'messages'>('projects');
  
  // Get all projects
  const { 
    data: projects, 
    isLoading: projectsLoading, 
    error: projectsError, 
    refetch: refetchProjects 
  } = useQuery('admin-projects', projectService.getAll.bind(projectService));
  
  // Get all messages
  const { 
    data: messages, 
    isLoading: messagesLoading, 
    error: messagesError, 
    refetch: refetchMessages 
  } = useQuery('admin-messages', contactService.getAll.bind(contactService));

  return (
    <div className={styles.adminDashboard}>
      <h1 className={styles.title}>Admin Dashboard</h1>
      
      <div className={styles.tabs}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'projects' ? styles.active : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'messages' ? styles.active : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          Messages {messages && messages.filter(m => !m.read).length > 0 && (
            <span className={styles.badge}>
              {messages.filter(m => !m.read).length}
            </span>
          )}
        </button>
      </div>
      
      <div className={styles.tabContent}>
        {activeTab === 'projects' && (
          <div className={styles.projectsTab}>
            <div className={styles.header}>
              <h2>Manage Projects</h2>
              <button className={styles.addButton}>Add New Project</button>
            </div>
            
            {projectsLoading ? (
              <LoadingSpinner />
            ) : projectsError ? (
              <ErrorMessage message={projectsError} retryFn={refetchProjects} />
            ) : (
              <div className={styles.projectsList}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Technologies</th>
                      <th>Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects && projects.length > 0 ? (
                      projects.map(project => (
                        <tr key={project._id}>
                          <td>{project.title}</td>
                          <td>
                            <div className={styles.techTags}>
                              {project.technologies.map((tech, i) => (
                                <span key={i} className={styles.techTag}>{tech}</span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <span className={project.featured ? styles.featured : styles.notFeatured}>
                              {project.featured ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td>
                            <div className={styles.actions}>
                              <button className={styles.editButton}>Edit</button>
                              <button className={styles.deleteButton}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className={styles.noData}>
                          No projects found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'messages' && (
          <div className={styles.messagesTab}>
            <h2>Contact Messages</h2>
            
            {messagesLoading ? (
              <LoadingSpinner />
            ) : messagesError ? (
              <ErrorMessage message={messagesError} retryFn={refetchMessages} />
            ) : (
              <div className={styles.messagesList}>
                {messages && messages.length > 0 ? (
                  messages.map(message => (
                    <div key={message._id} className={`${styles.messageCard} ${!message.read ? styles.unread : ''}`}>
                      <div className={styles.messageHeader}>
                        <h3 className={styles.messageSender}>{message.name}</h3>
                        <span className={styles.messageDate}>
                          {new Date(message.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className={styles.messageInfo}>
                        <p className={styles.messageEmail}>{message.email}</p>
                        <p className={styles.messageSubject}>
                          <strong>Subject:</strong> {message.subject}
                        </p>
                      </div>
                      <p className={styles.messageContent}>{message.message}</p>
                      <div className={styles.messageActions}>
                        {!message.read && (
                          <button 
                            className={styles.markReadButton}
                            onClick={() => {
                              contactService.markAsRead(message._id)
                                .then(() => refetchMessages());
                            }}
                          >
                            Mark as Read
                          </button>
                        )}
                        <button className={styles.deleteButton}>Delete</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={styles.noData}>No messages found.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;