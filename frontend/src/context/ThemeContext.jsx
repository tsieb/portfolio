// /frontend/src/context/ThemeContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

const ThemeContext = createContext();

/**
 * Provider component for theme context
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} ThemeProvider component
 */
export const ThemeProvider = ({ children }) => {
  // Default to dark mode
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Apply theme class to body when theme changes
  useEffect(() => {
    const body = document.body;
    if (isDarkMode) {
      body.classList.add('dark-mode');
      body.classList.remove('light-mode');
    } else {
      body.classList.add('light-mode');
      body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  /**
   * Toggle between dark and light modes
   */
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const value = {
    isDarkMode,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook for accessing theme context
 * @returns {Object} Theme context value
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 