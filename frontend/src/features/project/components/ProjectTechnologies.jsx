// /frontend/src/features/project/components/ProjectTechnologies.jsx
import PropTypes from 'prop-types';
import { useTheme } from '@context/ThemeContext';
import styles from '@assets/styles/features/project/ProjectTechnologies.module.scss';

/**
 * Project technologies component showing tech stack used
 * @param {Object} props - Component props
 * @param {string[]} props.technologies - Array of technology names
 * @returns {JSX.Element} ProjectTechnologies component
 */
const ProjectTechnologies = ({ technologies }) => {
  const { isDarkMode } = useTheme();
  
  // Skip rendering if no technologies
  if (!technologies || technologies.length === 0) {
    return null;
  }
  
  // Mapping of technology names to icons and colors
  // This is a simplified version - in a real app, you might want to use a more comprehensive mapping
  const techInfo = {
    React: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <circle cx="12" cy="12" r="2.139" fill="currentColor"/>
          <path fill="currentColor" d="M12,1,9.26,1.152a11.617,11.617,0,0,0-6.375,2.8A11.893,11.893,0,0,0,0,11.539c.345.359.4.453.542.565a12.366,12.366,0,0,0,2.437,1.77,11.858,11.858,0,0,0,6.3,2A11.769,11.769,0,0,0,20.9,12.372a11.656,11.656,0,0,0,2.429-2.3c.451-.555.475-.614.669-1.131a11.624,11.624,0,0,0-2.573-5.85A11.951,11.951,0,0,0,16.37,3.259a11.547,11.547,0,0,0-4.184-.86C12.116,2.392,12.058,1,12,1Z"/>
        </svg>
      ),
      color: '#61DAFB'
    },
    Node: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M12,1.85a1.62,1.62,0,0,0-.78.2L3.78,6.35A1.58,1.58,0,0,0,3,7.75v8.5a1.58,1.58,0,0,0,.78,1.4l7.44,4.3a1.62,1.62,0,0,0,1.56,0l7.44-4.3a1.58,1.58,0,0,0,.78-1.4V7.75a1.58,1.58,0,0,0-.78-1.4L12.78,2.05A1.62,1.62,0,0,0,12,1.85Zm0,3.77a.59.59,0,0,1,.28.07l2.5,1.47a.57.57,0,0,1,.29.5v2.9a.57.57,0,0,1-.29.5l-2.5,1.47a.61.61,0,0,1-.56,0L9.22,11.06a.57.57,0,0,1-.29-.5V7.66a.57.57,0,0,1,.29-.5l2.5-1.47A.59.59,0,0,1,12,5.62Z"/>
        </svg>
      ),
      color: '#43853d'
    },
    MongoDB: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M17.18,9.87c-1.23-5.42-4.15-7.2-4.46-7.88A10.32,10.32,0,0,1,12,1a12.64,12.64,0,0,0-.74,1c-.33.66-3.25,2.44-4.48,7.85a10.77,10.77,0,0,0,.38,8.19c.74,1.58,1.92,2.7,3.06,3.43a4.12,4.12,0,0,1,1.56,1.76h.08a3.09,3.09,0,0,1,1.48-1.74c1.14-.73,2.32-1.85,3.06-3.43A10.77,10.77,0,0,0,17.18,9.87Z"/>
        </svg>
      ),
      color: '#13AA52'
    },
    Express: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M24,18.67V14.43c0-1.53-1.4-2.76-3.13-2.76H12.23C9.82,11.67,8,9.53,8,7c0-2.89,1.75-5.33,4.33-5.33s4.33,2.44,4.33,5.33v1.33H19V7c0-3.87-3-7-6.67-7S5.67,3.13,5.67,7c0,3.48,2.65,6.33,6.08,6.66v.01h9.12c.93,0,1.68.76,1.68,1.66v3.33H20.8c-.32-1.66-1.86-2.76-3.48-2.76-1.9,0-3.47,1.44-3.47,3.33s1.57,3.33,3.47,3.33c1.62,0,3.16-1.1,3.48-2.76H24Z"/>
        </svg>
      ),
      color: '#000000'
    },
    TypeScript: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M3,3H21V21H3V3M13.71,17.86C14.21,18.84 15.22,19.59 16.8,19.59C18.4,19.59 19.6,18.76 19.6,17.23C19.6,15.82 18.79,15.19 17.35,14.57L16.93,14.39C16.2,14.08 15.89,13.87 15.89,13.37C15.89,12.96 16.2,12.64 16.7,12.64C17.18,12.64 17.5,12.85 17.79,13.37L19.1,12.5C18.55,11.54 17.77,11.17 16.7,11.17C15.19,11.17 14.22,12.13 14.22,13.4C14.22,14.78 15.03,15.43 16.25,15.95L16.67,16.13C17.45,16.47 17.91,16.68 17.91,17.26C17.91,17.74 17.46,18.09 16.76,18.09C15.93,18.09 15.45,17.66 15.09,17.06L13.71,17.86M13,11.25H8V12.75H9.5V20H11.25V12.75H13V11.25Z"/>
        </svg>
      ),
      color: '#007acc'
    },
    JavaScript: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M3,3H21V21H3V3M7.73,18.04C8.13,18.89 8.92,19.59 10.27,19.59C11.77,19.59 12.73,18.79 12.73,17.04V11.26H11.03V17C11.03,17.86 10.67,18.08 10.1,18.08C9.43,18.08 9.04,17.66 8.82,17.25L7.73,18.04M13.71,17.86C14.21,18.84 15.22,19.59 16.8,19.59C18.4,19.59 19.6,18.76 19.6,17.23C19.6,15.82 18.79,15.19 17.35,14.57L16.93,14.39C16.2,14.08 15.89,13.87 15.89,13.37C15.89,12.96 16.2,12.64 16.7,12.64C17.18,12.64 17.5,12.85 17.79,13.37L19.1,12.5C18.55,11.54 17.77,11.17 16.7,11.17C15.19,11.17 14.22,12.13 14.22,13.4C14.22,14.78 15.03,15.43 16.25,15.95L16.67,16.13C17.45,16.47 17.91,16.68 17.91,17.26C17.91,17.74 17.46,18.09 16.76,18.09C15.93,18.09 15.45,17.66 15.09,17.06L13.71,17.86Z"/>
        </svg>
      ),
      color: '#f7df1e'
    },
    SCSS: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M12,2A10,10,0,1,1,2,12,10,10,0,0,1,12,2m0,18.25A8.25,8.25,0,1,0,3.75,12,8.25,8.25,0,0,0,12,20.25M16.04,7.71a2.69,2.69,0,0,0-1.24.31c-.27-.53-.53-1-.58-1.35-.05-.4-.11-.64-.05-1.12s.32-.84,.32-.88-.06-.15-.64-.16-.87,.07-1.05,.16a5.4,5.4,0,0,0-.28,.6c-.12,.61-.53,2.06-.81,2.9-.09-.18-.17-.33-.23-.47-.37-.77-.62-1.25-.62-1.79,0-.58,.19-.98,.19-1.03s-.26-.17-.84-.17c-.65,.01-.87,.15-1.04,.36-.11,.13-.2,.44-.2,.44s-.13,.72-.3,1.75c-.29,1.58-.47,2.54-.47,2.54,0,0-.01,.05-.03,.14l-.5,.28c0,0-.25,.13-.77,.13-.57,0-.38-.73-.38-.73,.35-.29,.75-1.1,.75-1.86a3,3,0,0,0-.52-1.64c-.29-.39-1.05-.57-1.48-.57-.51,0-1.03,.11-1.43,.27-.19,.09-.66,.33-.95,.33-.33,0-.41-.43-.41-.43,0-.4,.31-1.38,3.21-1.38,2.57,0,4.1,1.32,4.1,3.78,0,.97-.44,2.04-1.31,2.04-.47,0-.73-.36-.73-.36s-.48-1.31-.62-1.65c-.05,0-.13-.02-.13-.02-1.47,0-2.61,1.39-2.61,3.05,0,1.07,.5,1.54,1.05,1.54,.38,0,.84-.33,1.07-.92l.67-2.28c.4,.46,1.45,.85,2.17,.85,1.39,0,2.58-.56,3.5-1.74,.83-1.09,1.17-2.62,1.17-3.92,0-1.75-.77-2.17-1.42-2.17Z"/>
        </svg>
      ),
      color: '#cc6699'
    },
    CSS: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M5,3L4.35,6.34H17.94L17.5,8.5H3.92L3.26,11.83H16.85L16.09,15.64L10.61,17.45L5.86,15.64L6.19,14H2.85L2.06,18L9.91,21L18.96,18L20.16,11.97L20.4,10.76L21.94,3H5Z"/>
        </svg>
      ),
      color: '#1572B6'
    },
    HTML: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M12,17.56L16.07,16.43L16.62,10.33H9.38L9.2,8.3H16.8L17,6.31H7L7.56,12.32H14.45L14.22,14.9L12,15.5L9.78,14.9L9.64,13.24H7.64L7.93,16.43L12,17.56M4.07,3H19.93L18.5,19.2L12,21L5.5,19.2L4.07,3Z"/>
        </svg>
      ),
      color: '#E34F26'
    },
    GraphQL: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M12,15.89H11V15.07h2v.82Zm.5-9.49L8.28,12.5l4.22,6.1,4.22-6.1ZM13,4V2H11V4ZM3.93,12.5,2.84,13.57,3.92,14.64,5,13.57ZM13,22v-2H11v2ZM21,13.57l-1.09-1.07L18.84,13.57l1.09,1.07Zm.25-1.07a1.82,1.82,0,0,0-.58-1.33L13.18,2.45a1.83,1.83,0,0,0-2.36,0L3.33,11.17a1.82,1.82,0,0,0,0,2.66l7.49,8.73a1.83,1.83,0,0,0,2.36,0l7.49-8.73A1.82,1.82,0,0,0,21.25,12.5Z"/>
        </svg>
      ),
      color: '#E10098'
    },
  };
  
  // Create tech cards with icons and names
  const renderTechCard = (tech) => {
    const info = techInfo[tech] || { 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      ),
      color: isDarkMode ? '#ffffff' : '#000000'
    };
    
    return (
      <div 
        key={tech} 
        className={styles.techCard}
        style={{ '--tech-color': info.color }}
      >
        <div className={styles.techIcon}>
          {info.icon}
        </div>
        <span className={styles.techName}>{tech}</span>
      </div>
    );
  };
  
  return (
    <section className={`${styles.technologies} ${isDarkMode ? styles.dark : ''}`}>
      <h2 className={styles.sectionTitle}>Technology Stack</h2>
      
      <div className={styles.techGrid}>
        {technologies.map(tech => renderTechCard(tech))}
      </div>
    </section>
  );
};

ProjectTechnologies.propTypes = {
  technologies: PropTypes.arrayOf(PropTypes.string)
};

export default ProjectTechnologies;