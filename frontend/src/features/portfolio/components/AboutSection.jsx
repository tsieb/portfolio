// /frontend/src/features/portfolio/components/AboutSection.jsx
import styles from '@assets/styles/features/portfolio/AboutSection.module.scss';

/**
 * About section with developer information
 * @returns {JSX.Element} AboutSection component
 */
const AboutSection = () => {
  return (
    <section id="about" className={styles.aboutSection}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>About The Developer</h2>
          
          <div className={styles.bio}>
            <p>
              I'm a full-stack developer passionate about creating interactive web applications with elegant interfaces. With expertise in JavaScript, React, Node.js, and modern web technologies, I craft digital experiences that are both functional and beautiful.
            </p>
            <p>
              My approach combines clean code, thoughtful architecture, and user-centered design. I believe in building scalable systems that can evolve with changing needs while maintaining high standards of performance and security.
            </p>
          </div>
          
          <div className={styles.skillsContainer}>
            <h3 className={styles.skillsTitle}>Technical Skills</h3>
            
            <div className={styles.skillCategories}>
              <div className={styles.skillCategory}>
                <h4>Frontend</h4>
                <ul className={styles.skillList}>
                  <li>React & React Hooks</li>
                  <li>JavaScript (ES6+)</li>
                  <li>TypeScript</li>
                  <li>HTML5 & CSS3</li>
                  <li>Responsive Design</li>
                  <li>State Management</li>
                </ul>
              </div>
              
              <div className={styles.skillCategory}>
                <h4>Backend</h4>
                <ul className={styles.skillList}>
                  <li>Node.js</li>
                  <li>Express.js</li>
                  <li>RESTful APIs</li>
                  <li>MongoDB</li>
                  <li>Authentication</li>
                  <li>Server Security</li>
                </ul>
              </div>
              
              <div className={styles.skillCategory}>
                <h4>Tools & Practices</h4>
                <ul className={styles.skillList}>
                  <li>Git & GitHub</li>
                  <li>Docker</li>
                  <li>AWS</li>
                  <li>Test-Driven Development</li>
                  <li>CI/CD</li>
                  <li>Agile Development</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.imageContainer}>
          <div className={styles.imageFrame}>
            <div className={styles.image}>
              {/* Placeholder for developer image */}
              <div className={styles.placeholder}>
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;