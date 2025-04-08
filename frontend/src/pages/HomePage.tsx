import { Link } from 'react-router-dom';
import { useQuery } from '../hooks/useQuery';
import { portfolioService } from '../services/portfolioService';
import { projectService } from '../services/projectService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import styles from './HomePage.module.scss';

/**
 * Home page component
 */
const HomePage = () => {
  // Get portfolio data
  const { 
    data: portfolio, 
    isLoading: portfolioLoading, 
    error: portfolioError 
  } = useQuery('portfolio', portfolioService.getPortfolio);
  
  // Get featured projects
  const { 
    data: featuredProjects, 
    isLoading: projectsLoading, 
    error: projectsError 
  } = useQuery('featuredProjects', projectService.getFeaturedProjects);
  
  // Show loading spinner while data is loading
  if (portfolioLoading || projectsLoading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div className={styles.homepage}>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          {portfolio?.owner.name || 'John Doe'}
        </h1>
        <p className={styles.subtitle}>
          {portfolio?.owner.title || 'Full Stack Developer specializing in modern web technologies'}
        </p>
        <div className={styles.actions}>
          <Link to="/projects" className={styles.primaryButton}>
            View Projects
          </Link>
          <Link to="/contact" className={styles.secondaryButton}>
            Contact Me
          </Link>
        </div>
      </section>
      
      <section className={styles.about}>
        <h2 className={styles.sectionTitle}>About Me</h2>
        {portfolioError ? (
          <ErrorMessage message="Failed to load portfolio data. Please try again later." />
        ) : (
          <div className={styles.aboutContent}>
            <div className={styles.aboutText}>
              <p>{portfolio?.owner.bio || 'Bio information not available.'}</p>
            </div>
            <div className={styles.skills}>
              <h3 className={styles.skillsTitle}>Skills</h3>
              <ul className={styles.skillsList}>
                {portfolio?.skills.map((skill, index) => (
                  <li key={index} className={styles.skillItem}>
                    <span className={styles.skillName}>{skill.name}</span>
                    <div className={styles.skillBarContainer}>
                      <div 
                        className={styles.skillBar} 
                        style={{ width: `${skill.level}%` }}
                        aria-valuenow={skill.level}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        role="progressbar"
                      ></div>
                    </div>
                  </li>
                ))}
                {(!portfolio?.skills || portfolio.skills.length === 0) && (
                  <li className={styles.skillItem}>Skills information not available.</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </section>
      
      <section className={styles.featuredProjects}>
        <h2 className={styles.sectionTitle}>Featured Projects</h2>
        {projectsError ? (
          <ErrorMessage message="Failed to load projects. Please try again later." />
        ) : featuredProjects && featuredProjects.length > 0 ? (
          <>
            <div className={styles.projectsGrid}>
              {featuredProjects.map((project) => (
                <div key={project._id} className={styles.projectCard}>
                  <div 
                    className={styles.projectImage}
                    style={{ backgroundImage: `url(${project.image})` }}
                  ></div>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <p className={styles.projectDescription}>
                    {project.description}
                  </p>
                  <Link to={`/projects/${project._id}`} className={styles.projectLink}>
                    View Project
                  </Link>
                </div>
              ))}
            </div>
            <div className={styles.viewAll}>
              <Link to="/projects" className={styles.viewAllLink}>
                View All Projects
              </Link>
            </div>
          </>
        ) : (
          <div className={styles.noProjects}>
            <p>No featured projects available at the moment.</p>
            <Link to="/projects" className={styles.viewAllLink}>
              Browse All Projects
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;