// /frontend/src/features/project/components/ProjectHeader.jsx
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTheme } from '@context/ThemeContext';
import styles from '@assets/styles/features/project/ProjectHeader.module.scss';

/**
 * Project header component with title and background
 * @param {Object} props - Component props
 * @param {Object} props.project - Project data object
 * @returns {JSX.Element} ProjectHeader component
 */
const ProjectHeader = ({ project }) => {
  const { isDarkMode } = useTheme();
  const canvasRef = useRef(null);
  
  // Animated background effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Set canvas dimensions
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Parse project color or use default
    const getColorComponents = () => {
      const defaultColor = isDarkMode ? '#5d8eff' : '#4a7bfc';
      const color = project.color || defaultColor;
      
      // Handle hex format
      if (color.startsWith('#')) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        return { r, g, b };
      }
      
      // Handle rgb/rgba format
      if (color.startsWith('rgb')) {
        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
        if (match) {
          return {
            r: parseInt(match[1]),
            g: parseInt(match[2]),
            b: parseInt(match[3])
          };
        }
      }
      
      // Default color components
      return isDarkMode ? { r: 93, g: 142, b: 255 } : { r: 74, g: 123, b: 252 };
    };
    
    const colorComponents = getColorComponents();
    
    // Create particles
    const particles = [];
    const particleCount = Math.floor(canvas.width * canvas.height / 8000);
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dark gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      
      if (isDarkMode) {
        gradient.addColorStop(0, `rgba(${colorComponents.r * 0.2}, ${colorComponents.g * 0.2}, ${colorComponents.b * 0.2}, 1)`);
        gradient.addColorStop(1, 'rgba(5, 8, 24, 1)');
      } else {
        gradient.addColorStop(0, `rgba(${colorComponents.r * 0.9}, ${colorComponents.g * 0.9}, ${colorComponents.b * 0.9}, 0.2)`);
        gradient.addColorStop(1, 'rgba(240, 248, 255, 1)');
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw and update particles
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colorComponents.r}, ${colorComponents.g}, ${colorComponents.b}, ${particle.opacity})`;
        ctx.fill();
        
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [project.color, isDarkMode]);
  
  return (
    <header className={`${styles.projectHeader} ${isDarkMode ? styles.dark : ''}`}>
      <canvas ref={canvasRef} className={styles.headerBackground} />
      
      <div className={styles.headerContent}>
        <div className={styles.breadcrumbs}>
          <Link to="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link to="/#projects" className={styles.breadcrumbLink}>Projects</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{project.title}</span>
        </div>
        
        <h1 className={styles.projectTitle}>{project.title}</h1>
        
        <p className={styles.projectDescription}>
          {project.description}
        </p>
        
        {project.technologies && project.technologies.length > 0 && (
          <div className={styles.technologies}>
            {project.technologies.map((tech, index) => (
              <span key={index} className={styles.technology}>
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

ProjectHeader.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    technologies: PropTypes.arrayOf(PropTypes.string),
    color: PropTypes.string
  }).isRequired
};

export default ProjectHeader;