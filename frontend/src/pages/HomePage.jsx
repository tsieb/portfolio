// /frontend/src/pages/HomePage.jsx
import { useEffect } from 'react';
import { useProjects } from '@context/ProjectsContext';
import SpaceCanvas from '@features/portfolio/components/SpaceCanvas';
import ProjectPlanet from '@features/portfolio/components/ProjectPlanet';
import HeroSection from '@features/portfolio/components/HeroSection';
import AboutSection from '@features/portfolio/components/AboutSection';
import LoadingSpinner from '@components/ui/LoadingSpinner';
import styles from '@assets/styles/pages/HomePage.module.scss';

/**
 * Home page component with space-themed portfolio
 * @returns {JSX.Element} HomePage component
 */
const HomePage = () => {
  const { featuredProjects, loading, error } = useProjects();
  
  useEffect(() => {
    // Set page title
    document.title = 'Space Portfolio | Home';
  }, []);
  
  return (
    <div className={styles.homePage}>
      <HeroSection />
      
      <section className={styles.spaceSection}>
        <h2 className={styles.sectionTitle}>Explore My Projects</h2>
        <p className={styles.sectionDescription}>
          Navigate through the cosmic universe of my projects. Each planet represents a unique creation.
        </p>
        
        {loading ? (
          <div className={styles.loading}>
            <LoadingSpinner />
            <p>Loading projects from the cosmos...</p>
          </div>
        ) : error ? (
          <div className={styles.error}>
            <p>Houston, we have a problem! Failed to load projects.</p>
            <button className={styles.retryButton}>Retry</button>
          </div>
        ) : (
          <div className={styles.spaceCanvasContainer}>
            <SpaceCanvas>
              {featuredProjects.map((project, index) => (
                <ProjectPlanet 
                  key={project.id}
                  project={project}
                  index={index}
                  totalProjects={featuredProjects.length}
                />
              ))}
            </SpaceCanvas>
          </div>
        )}
      </section>
      
      <AboutSection />
    </div>
  );
};

export default HomePage;