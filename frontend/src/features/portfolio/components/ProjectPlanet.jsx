// /frontend/src/features/portfolio/components/ProjectPlanet.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from '@assets/styles/features/portfolio/ProjectPlanet.module.scss';

/**
 * Project planet component representing a project as a planet
 * @param {Object} props - Component props
 * @param {Object} props.project - Project data
 * @param {number} props.index - Index of the project in the list
 * @param {number} props.totalProjects - Total number of projects
 * @returns {JSX.Element} ProjectPlanet component
 */
const ProjectPlanet = ({ project, index, totalProjects }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate orbit parameters based on index
  const orbitSize = 100 + (index * 70); // Increasing orbit size
  const orbitSpeed = 20 - (index * 2); // Decreasing orbit speed (higher = slower)
  const planetSize = 40 + (15 * Math.random()); // Random planet size
  const rotationOffset = (360 / totalProjects) * index; // Distribute planets evenly
  
  // Generate random planet features
  const planetColor = project.color || generateRandomColor(project.id);
  const hasMoons = Math.random() > 0.5;
  const hasRings = Math.random() > 0.7;
  
  /**
   * Generate a random color from project ID
   * @param {string} id - Project ID
   * @returns {string} CSS color
   */
  function generateRandomColor(id) {
    // Generate consistent color from ID
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Generate HSL color with high saturation and limited lightness range for vibrant colors
    const h = Math.abs(hash % 360);
    const s = 70 + (hash % 20); // 70-90% saturation
    const l = 45 + (hash % 20); // 45-65% lightness
    
    return `hsl(${h}, ${s}%, ${l}%)`;
  }
  
  return (
    <div 
      className={styles.orbitContainer}
      style={{
        '--orbit-size': `${orbitSize}px`,
        '--orbit-speed': `${orbitSpeed}s`,
        '--rotation-offset': `${rotationOffset}deg`
      }}
    >
      <div className={styles.orbit}>
        <div 
          className={styles.planetContainer}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Link to={`/projects/${project.id}`} className={styles.planetLink}>
            <div 
              className={styles.planet}
              style={{
                width: `${planetSize}px`,
                height: `${planetSize}px`,
                backgroundColor: planetColor,
                boxShadow: `0 0 20px ${planetColor}33, 0 0 40px ${planetColor}22`
              }}
            >
              {hasRings && (
                <div className={styles.rings} style={{
                  borderColor: `${planetColor}66`,
                  transform: `rotate(${Math.random() * 90}deg)`
                }} />
              )}
              
              {hasMoons && (
                <div 
                  className={styles.moon}
                  style={{
                    '--moon-orbit': `${planetSize * 2}px`,
                    '--moon-size': `${planetSize * 0.3}px`,
                    '--moon-speed': '5s'
                  }}
                />
              )}
            </div>
          </Link>
          
          {isHovered && (
            <div className={styles.projectInfo}>
              <h3 className={styles.projectTitle}>{project.title}</h3>
              <p className={styles.projectDescription}>{project.description}</p>
              <div className={styles.projectTags}>
                {project.tags?.map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ProjectPlanet.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    color: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  index: PropTypes.number.isRequired,
  totalProjects: PropTypes.number.isRequired
};

export default ProjectPlanet;