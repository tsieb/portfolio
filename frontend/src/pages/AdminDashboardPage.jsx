// /frontend/src/pages/AdminDashboardPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { useProjects } from '@context/ProjectsContext';
import DashboardStats from '@features/authentication/components/DashboardStats';
import RecentMessages from '@features/authentication/components/RecentMessages';
import RecentProjects from '@features/authentication/components/RecentProjects';
import LoadingSpinner from '@components/ui/LoadingSpinner';
import styles from '@assets/styles/pages/AdminDashboardPage.module.scss';
import contactService from '@services/contactService';

/**
 * Admin dashboard page component
 * @returns {JSX.Element} AdminDashboardPage component
 */
const AdminDashboardPage = () => {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const { projects, loading: projectsLoading } = useProjects();
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [messagesError, setMessagesError] = useState(null);
  const navigate = useNavigate();
  
  // Set page title
  useEffect(() => {
    document.title = 'Admin Dashboard | Space Portfolio';
  }, []);
  
  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    } else if (!isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);
  
  // Fetch recent messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setMessagesLoading(true);
        // Fetch 5 most recent messages
        const response = await contactService.getMessages({
          limit: 5,
          sort: '-createdAt'
        });
        setMessages(response.data || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setMessagesError('Failed to load recent messages');
      } finally {
        setMessagesLoading(false);
      }
    };
    
    if (isAuthenticated && isAdmin) {
      fetchMessages();
    }
  }, [isAuthenticated, isAdmin]);
  
  // Calculate dashboard statistics
  const stats = [
    {
      title: 'Total Projects',
      value: projects?.length || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
          <polyline points="2 17 12 22 22 17"></polyline>
          <polyline points="2 12 12 17 22 12"></polyline>
        </svg>
      ),
      color: 'blue'
    },
    {
      title: 'Featured Projects',
      value: projects?.filter(p => p.featured)?.length || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      ),
      color: 'purple'
    },
    {
      title: 'New Messages',
      value: messages?.filter(m => m.status === 'new')?.length || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      ),
      color: 'green'
    },
    {
      title: 'Last Login',
      value: new Date().toLocaleDateString(),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
      color: 'orange'
    }
  ];
  
  // Loading state
  if (projectsLoading && messagesLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" />
        <p>Loading dashboard data...</p>
      </div>
    );
  }
  
  return (
    <div className={styles.adminDashboardPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Welcome back, {user?.name || 'Admin'}</p>
      </div>
      
      <div className={styles.statsContainer}>
        <DashboardStats stats={stats} />
      </div>
      
      <div className={styles.contentGrid}>
        <div className={styles.recentProjectsSection}>
          <h2 className={styles.sectionTitle}>Recent Projects</h2>
          <RecentProjects 
            projects={projects?.slice(0, 5) || []} 
            loading={projectsLoading} 
            error={null} 
          />
        </div>
        
        <div className={styles.recentMessagesSection}>
          <h2 className={styles.sectionTitle}>Recent Messages</h2>
          <RecentMessages 
            messages={messages} 
            loading={messagesLoading} 
            error={messagesError} 
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;