// /frontend/src/components/ui/LoadingSpinner.jsx
import PropTypes from 'prop-types';
import styles from '@assets/styles/components/LoadingSpinner.module.scss';

/**
 * Loading spinner component with cosmic theme
 * @param {Object} props - Component props
 * @param {string} props.size - Size of the spinner (small, medium, large)
 * @param {string} props.color - Custom color for the spinner
 * @returns {JSX.Element} LoadingSpinner component
 */
const LoadingSpinner = ({ size, color }) => {
  const sizeClass = size ? styles[size] : styles.medium;
  const customStyle = color ? { borderColor: `${color} transparent transparent transparent` } : {};
  
  return (
    <div className={`${styles.spinner} ${sizeClass}`}>
      <div className={styles.ring} style={customStyle}></div>
      <div className={styles.ring} style={customStyle}></div>
      <div className={styles.ring} style={customStyle}></div>
      <div className={styles.planet} style={color ? { backgroundColor: color } : {}}></div>
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.string
};

export default LoadingSpinner;