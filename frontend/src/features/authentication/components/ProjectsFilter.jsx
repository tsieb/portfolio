// /frontend/src/features/authentication/components/ProjectsFilter.jsx
import PropTypes from 'prop-types';
import { useTheme } from '@context/ThemeContext';
import styles from '@assets/styles/features/authentication/ProjectsFilter.module.scss';

/**
 * Projects filter component for admin dashboard
 * @param {Object} props - Component props
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.onFilterChange - Function to handle filter changes
 * @returns {JSX.Element} ProjectsFilter component
 */
const ProjectsFilter = ({ filters, onFilterChange }) => {
  const { isDarkMode } = useTheme();
  
  // Handle search input change
  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value });
  };
  
  // Handle featured filter change
  const handleFeaturedChange = (e) => {
    onFilterChange({ featured: e.target.value });
  };
  
  // Handle sort field change
  const handleSortByChange = (e) => {
    onFilterChange({ sortBy: e.target.value });
  };
  
  // Handle sort order change
  const handleSortOrderChange = (e) => {
    onFilterChange({ sortOrder: e.target.value });
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    onFilterChange({
      search: '',
      featured: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };
  
  return (
    <div className={`${styles.projectsFilter} ${isDarkMode ? styles.dark : ''}`}>
      <div className={styles.searchBox}>
        <div className={styles.searchInputWrapper}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.searchIcon}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search projects..."
            value={filters.search}
            onChange={handleSearchChange}
          />
          {filters.search && (
            <button 
              className={styles.clearSearchButton}
              onClick={() => onFilterChange({ search: '' })}
              aria-label="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </div>
      
      <div className={styles.filtersGroup}>
        <div className={styles.filterItem}>
          <label htmlFor="featured" className={styles.filterLabel}>Status</label>
          <select
            id="featured"
            className={styles.filterSelect}
            value={filters.featured}
            onChange={handleFeaturedChange}
          >
            <option value="all">All Projects</option>
            <option value="featured">Featured Only</option>
            <option value="standard">Standard Only</option>
          </select>
        </div>
        
        <div className={styles.filterItem}>
          <label htmlFor="sortBy" className={styles.filterLabel}>Sort By</label>
          <select
            id="sortBy"
            className={styles.filterSelect}
            value={filters.sortBy}
            onChange={handleSortByChange}
          >
            <option value="createdAt">Date Created</option>
            <option value="title">Title</option>
            <option value="updatedAt">Last Updated</option>
          </select>
        </div>
        
        <div className={styles.filterItem}>
          <label htmlFor="sortOrder" className={styles.filterLabel}>Order</label>
          <select
            id="sortOrder"
            className={styles.filterSelect}
            value={filters.sortOrder}
            onChange={handleSortOrderChange}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
        
        {(filters.search || filters.featured !== 'all' || 
          filters.sortBy !== 'createdAt' || filters.sortOrder !== 'desc') && (
          <button 
            className={styles.clearFiltersButton}
            onClick={handleClearFilters}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

ProjectsFilter.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string.isRequired,
    featured: PropTypes.string.isRequired,
    sortBy: PropTypes.string.isRequired,
    sortOrder: PropTypes.string.isRequired
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired
};

export default ProjectsFilter;