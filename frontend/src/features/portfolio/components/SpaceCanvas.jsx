// /frontend/src/features/portfolio/components/SpaceCanvas.jsx
import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@context/ThemeContext';
import styles from '@assets/styles/features/portfolio/SpaceCanvas.module.scss';

/**
 * Interactive space canvas with animated stars and orbits
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components (planets)
 * @returns {JSX.Element} SpaceCanvas component
 */
const SpaceCanvas = ({ children }) => {
  const canvasRef = useRef(null);
  const { isDarkMode } = useTheme();
  
  // Animation for stars in the background
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
    
    // Create stars
    const stars = [];
    const starCount = Math.floor(canvas.width * canvas.height / 1000);
    
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        opacity: Math.random(),
        speed: Math.random() * 0.05
      });
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background color
      ctx.fillStyle = isDarkMode ? '#050818' : '#f0f8ff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
        
        // Twinkle effect
        star.opacity += star.speed;
        if (star.opacity > 1 || star.opacity < 0) {
          star.speed = -star.speed;
        }
        
        // Slow drift movement
        star.x += (Math.random() - 0.5) * 0.1;
        star.y += (Math.random() - 0.5) * 0.1;
        
        // Keep stars within bounds
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);
  
  return (
    <div className={styles.spaceCanvas}>
      <canvas ref={canvasRef} className={styles.starsCanvas} />
      <div className={styles.sun}>
        <div className={styles.sunCore} />
        <div className={styles.sunRays} />
      </div>
      <div className={styles.planetsContainer}>
        {children}
      </div>
    </div>
  );
};

SpaceCanvas.propTypes = {
  children: PropTypes.node
};

export default SpaceCanvas;