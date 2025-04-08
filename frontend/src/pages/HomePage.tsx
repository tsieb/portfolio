import { Link } from 'react-router-dom';
import styles from './HomePage.module.scss';

/**
 * Home page component
 */
const HomePage = () => {
  return (
    <div className={styles.homepage}>
      <section className={styles.hero}>
        <h1 className={styles.title}>John Doe</h1>
        <p className={styles.subtitle}>
          Full Stack Developer specializing in modern web technologies
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
        <div className={styles.aboutContent}>
          <div className={styles.aboutText}>
            <p>
              I'm a passionate developer with expertise in React, Node.js, and modern web development
              practices. With a strong foundation in both frontend and backend technologies, I create
              seamless, user-friendly applications.
            </p>
            <p>
              My approach combines technical excellence with creative problem-solving to build
              solutions that not only work flawlessly but also provide outstanding user experiences.
            </p>
          </div>
          <div className={styles.skills}>
            <h3 className={styles.skillsTitle}>Skills</h3>
            <ul className={styles.skillsList}>
              <li className={styles.skillItem}>React & React Native</li>
              <li className={styles.skillItem}>Node.js & Express</li>
              <li className={styles.skillItem}>TypeScript</li>
              <li className={styles.skillItem}>MongoDB & SQL Databases</li>
              <li className={styles.skillItem}>AWS & Cloud Infrastructure</li>
              <li className={styles.skillItem}>CI/CD & DevOps</li>
            </ul>
          </div>
        </div>
      </section>
      
      <section className={styles.featuredProjects}>
        <h2 className={styles.sectionTitle}>Featured Projects</h2>
        <div className={styles.projectsGrid}>
          {/* This would be populated with actual projects */}
          <div className={styles.projectCard}>
            <div className={styles.projectImage}></div>
            <h3 className={styles.projectTitle}>E-commerce Platform</h3>
            <p className={styles.projectDescription}>
              A full-stack e-commerce platform with shopping cart, user authentication, and payment processing.
            </p>
            <Link to="/projects/1" className={styles.projectLink}>
              View Project
            </Link>
          </div>
          <div className={styles.projectCard}>
            <div className={styles.projectImage}></div>
            <h3 className={styles.projectTitle}>Task Management App</h3>
            <p className={styles.projectDescription}>
              A task management application with drag-and-drop interface and real-time updates.
            </p>
            <Link to="/projects/2" className={styles.projectLink}>
              View Project
            </Link>
          </div>
        </div>
        <div className={styles.viewAll}>
          <Link to="/projects" className={styles.viewAllLink}>
            View All Projects
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;