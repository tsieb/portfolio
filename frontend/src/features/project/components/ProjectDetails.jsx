// /frontend/src/features/project/components/ProjectDetails.jsx
import PropTypes from 'prop-types';
import { useTheme } from '@context/ThemeContext';
import styles from '@assets/styles/features/project/ProjectDetails.module.scss';

/**
 * Project details component with full description
 * @param {Object} props - Component props
 * @param {Object} props.project - Project data object
 * @returns {JSX.Element} ProjectDetails component
 */
const ProjectDetails = ({ project }) => {
  const { isDarkMode } = useTheme();
  
  // If no full description is provided, use the short description
  const description = project.fullDescription || project.description;
  
  return (
    <section className={`${styles.projectDetails} ${isDarkMode ? styles.dark : ''}`}>
      <h2 className={styles.sectionTitle}>Project Overview</h2>
      
      <div className={styles.descriptionContent}>
        {/* Transform description into paragraphs if it contains line breaks */}
        {description.split('\n\n').map((paragraph, index) => (
          <p key={index} className={styles.paragraph}>
            {paragraph}
          </p>
        ))}
      </div>
      
      {/* Conditionally render key features if they exist in the project data */}
      {project.features && project.features.length > 0 && (
        <div className={styles.featuresSection}>
          <h3 className={styles.featuresTitle}>Key Features</h3>
          <ul className={styles.featuresList}>
            {project.features.map((feature, index) => (
              <li key={index} className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 11 12 14 22 4"></polyline>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                  </svg>
                </div>
                <div className={styles.featureContent}>
                  <h4 className={styles.featureTitle}>{feature.title}</h4>
                  <p className={styles.featureDescription}>{feature.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* If no explicit features array, but fullDescription contains bullet points, extract them */}
      {(!project.features || project.features.length === 0) && 
        description.includes('- ') && (
        <div className={styles.featuresSection}>
          <h3 className={styles.featuresTitle}>Key Features</h3>
          <ul className={styles.featuresList}>
            {description
              .split('\n')
              .filter(line => line.trim().startsWith('- '))
              .map((feature, index) => (
                <li key={index} className={styles.featureItem}>
                  <div className={styles.featureIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 11 12 14 22 4"></polyline>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                  </div>
                  <div className={styles.featureContent}>
                    <p className={styles.featureDescription}>
                      {feature.substring(2).trim()}
                    </p>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}
      
      {/* Conditionally render challenges and solutions if they exist */}
      {project.challenges && project.challenges.length > 0 && (
        <div className={styles.challengesSection}>
          <h3 className={styles.challengesTitle}>Challenges & Solutions</h3>
          {project.challenges.map((challenge, index) => (
            <div key={index} className={styles.challengeItem}>
              <h4 className={styles.challengeTitle}>{challenge.title}</h4>
              <p className={styles.challengeDescription}>{challenge.description}</p>
              {challenge.solution && (
                <>
                  <h5 className={styles.solutionTitle}>Solution:</h5>
                  <p className={styles.solutionDescription}>{challenge.solution}</p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

ProjectDetails.propTypes = {
  project: PropTypes.shape({
    description: PropTypes.string.isRequired,
    fullDescription: PropTypes.string,
    features: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired
    })),
    challenges: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      solution: PropTypes.string
    }))
  }).isRequired
};

export default ProjectDetails;