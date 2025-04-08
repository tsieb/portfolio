// /frontend/src/features/portfolio/components/HeroSection.jsx
import { useEffect, useRef } from 'react';
import styles from '@assets/styles/features/portfolio/HeroSection.module.scss';

/**
 * Hero section with animated text and space theme
 * @returns {JSX.Element} HeroSection component
 */
const HeroSection = () => {
  const titleRef = useRef(null);
  
  // Animate text typing effect
  useEffect(() => {
    const titleElement = titleRef.current;
    if (!titleElement) return;
    
    const text = "Welcome to my cosmic portfolio";
    let index = 0;
    let direction = 1; // 1 for typing, -1 for deleting
    
    const animateText = () => {
      if (direction === 1) {
        // Typing forward
        titleElement.textContent = text.substring(0, index) + '|';
        index++;
        
        if (index > text.length) {
          // Pause at end of text
          setTimeout(() => {
            direction = -1;
          }, 2000);
        }
      } else {
        // Deleting
        titleElement.textContent = text.substring(0, index) + '|';
        index--;
        
        if (index < 0) {
          // Reset to begin typing again
          setTimeout(() => {
            direction = 1;
            index = 0;
          }, 500);
        }
      }
    };
    
    // Run animation every 100ms
    const intervalId = setInterval(animateText, 100);
    
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <section className={styles.heroSection}>
      <div className={styles.content}>
        <h1 className={styles.title} ref={titleRef}>Welcome to my cosmic portfolio</h1>
        <p className={styles.subtitle}>
          Explore the universe of my projects. Each one represents a unique journey into web development, design, and creative problem-solving.
        </p>
        <div className={styles.actions}>
          <a href="#projects" className={styles.primaryButton}>
            Explore Projects
          </a>
          <a href="#about" className={styles.secondaryButton}>
            Learn About Me
          </a>
        </div>
      </div>
      
      <div className={styles.decorations}>
        <div className={styles.star} style={{ top: '10%', left: '20%', animationDelay: '0s' }} />
        <div className={styles.star} style={{ top: '30%', right: '15%', animationDelay: '0.5s' }} />
        <div className={styles.star} style={{ bottom: '20%', left: '30%', animationDelay: '1s' }} />
        <div className={styles.star} style={{ bottom: '40%', right: '25%', animationDelay: '1.5s' }} />
        <div className={styles.meteor} />
        <div className={styles.meteor} style={{ animationDelay: '3s' }} />
        <div className={styles.meteor} style={{ animationDelay: '5s' }} />
      </div>
    </section>
  );
};

export default HeroSection;