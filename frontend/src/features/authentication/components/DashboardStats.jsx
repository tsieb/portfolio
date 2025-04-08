// /frontend/src/features/authentication/components/DashboardStats.jsx
import PropTypes from 'prop-types';
import { useTheme } from '@context/ThemeContext';
import styles from '@assets/styles/features/authentication/DashboardStats.module.scss';

/**
 * Dashboard statistics component showing key metrics
 * @param {Object} props - Component props
 * @param {Array} props.stats - Array of stat objects
 * @returns {JSX.Element} DashboardStats component
 */
const DashboardStats = ({ stats }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`${styles.dashboardStats} ${isDarkMode ? styles.dark : ''}`}>
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className={`${styles.statCard} ${styles[stat.color || 'blue']}`}
        >
          <div className={styles.statIcon}>
            {stat.icon}
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statTitle}>{stat.title}</h3>
            <p className={styles.statValue}>{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

DashboardStats.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      icon: PropTypes.node,
      color: PropTypes.oneOf(['blue', 'green', 'purple', 'orange', 'red'])
    })
  ).isRequired
};

export default DashboardStats;