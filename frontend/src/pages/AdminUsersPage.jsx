// File: /frontend/src/pages/AdminUsersPage.jsx
// Admin users management page

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaUser, FaSearch, FaFilter, FaEdit, FaTrash, FaUserPlus, FaUserShield } from 'react-icons/fa';
import adminService from '../services/admin';

/**
 * Admin users page component
 * Displays a list of all users with filtering, sorting, and pagination
 */
const AdminUsersPage = () => {
  // State for users data
  const [usersData, setUsersData] = useState({
    users: [],
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      pages: 1
    }
  });
  
  // State for loading and error
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for filters
  const [filters, setFilters] = useState({
    search: '',
    sort: 'createdAt',
    order: 'desc',
    page: 1,
    limit: 20,
    onlySpotifyConnected: false
  });
  
  // State for filter visibility
  const [showFilters, setShowFilters] = useState(false);
  
  // State for user being deleted
  const [deletingUserId, setDeletingUserId] = useState(null);
  
  // Fetch users data
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await adminService.getUsers(filters);
      setUsersData(data);
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      toast.error('Error loading users');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      // Reset to page 1 when filters change
      page: name === 'page' ? value : 1
    }));
  };
  
  // Handle filter submit
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };
  
  // Handle filter reset
  const handleFilterReset = () => {
    setFilters({
      search: '',
      sort: 'createdAt',
      order: 'desc',
      page: 1,
      limit: 20,
      onlySpotifyConnected: false
    });
  };
  
  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > usersData.pagination.pages) return;
    
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };
  
  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    setDeletingUserId(userId);
    
    try {
      await adminService.deleteUser(userId);
      toast.success('User deleted successfully');
      fetchUsers(); // Refresh the list
    } catch (err) {
      toast.error('Failed to delete user');
    } finally {
      setDeletingUserId(null);
    }
  };
  
  // Fetch users on component mount and when filters change
  useEffect(() => {
    fetchUsers();
  }, [filters.page, filters.limit, filters.sort, filters.order]);
  
  // Generate pagination controls
  const renderPagination = () => {
    const { page, pages, total } = usersData.pagination;
    
    // Calculate start and end items
    const start = (page - 1) * filters.limit + 1;
    const end = Math.min(page * filters.limit, total);
    
    return (
      <div className="admin-pagination">
        <div className="admin-pagination__info">
          Showing {start}-{end} of {total} users
        </div>
        
        <div className="admin-pagination__controls">
          <button
            className="admin-pagination__button"
            onClick={() => handlePageChange(1)}
            disabled={page === 1}
            aria-label="First page"
          >
            &laquo;
          </button>
          
          <button
            className="admin-pagination__button"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            aria-label="Previous page"
          >
            &lsaquo;
          </button>
          
          {[...Array(Math.min(5, pages))].map((_, i) => {
            let pageNumber;
            
            if (pages <= 5) {
              // Show all pages if 5 or fewer
              pageNumber = i + 1;
            } else if (page <= 3) {
              // Show first 5 pages
              pageNumber = i + 1;
            } else if (page >= pages - 2) {
              // Show last 5 pages
              pageNumber = pages - 4 + i;
            } else {
              // Show current page and 2 pages before and after
              pageNumber = page - 2 + i;
            }
            
            return (
              <button
                key={pageNumber}
                className={`admin-pagination__button ${page === pageNumber ? 'active' : ''}`}
                onClick={() => handlePageChange(pageNumber)}
                aria-label={`Page ${pageNumber}`}
                aria-current={page === pageNumber ? 'page' : null}
              >
                {pageNumber}
              </button>
            );
          })}
          
          <button
            className="admin-pagination__button"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === pages}
            aria-label="Next page"
          >
            &rsaquo;
          </button>
          
          <button
            className="admin-pagination__button"
            onClick={() => handlePageChange(pages)}
            disabled={page === pages}
            aria-label="Last page"
          >
            &raquo;
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="admin-users">
      <div className="admin-users__header">
        <h1 className="admin-users__title">Users Management</h1>
        
        <div className="admin-users__actions">
          <button
            className="btn btn-secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter className="mr-sm" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          
          <button
            className="btn btn-primary"
            onClick={fetchUsers}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner spinner--sm mr-sm"></div>
                Loading...
              </>
            ) : (
              <>
                <FaSearch className="mr-sm" />
                Refresh
              </>
            )}
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="admin-filters">
          <form onSubmit={handleFilterSubmit} className="admin-filters__form">
            <div className="form-group">
              <label htmlFor="search" className="form-label">Search</label>
              <input
                type="text"
                id="search"
                name="search"
                className="form-input"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by username, name, or email"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="sort" className="form-label">Sort By</label>
              <select
                id="sort"
                name="sort"
                className="form-input"
                value={filters.sort}
                onChange={handleFilterChange}
              >
                <option value="createdAt">Registration Date</option>
                <option value="username">Username</option>
                <option value="lastActive">Last Active</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="order" className="form-label">Order</label>
              <select
                id="order"
                name="order"
                className="form-input"
                value={filters.order}
                onChange={handleFilterChange}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="limit" className="form-label">Items Per Page</label>
              <select
                id="limit"
                name="limit"
                className="form-input"
                value={filters.limit}
                onChange={handleFilterChange}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            
            <div className="form-group">
              <div className="form-checkbox">
                <input
                  type="checkbox"
                  id="onlySpotifyConnected"
                  name="onlySpotifyConnected"
                  checked={filters.onlySpotifyConnected}
                  onChange={handleFilterChange}
                />
                <label htmlFor="onlySpotifyConnected">
                  Only show Spotify-connected users
                </label>
              </div>
            </div>
            
            <div className="admin-filters__actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleFilterReset}
              >
                Reset
              </button>
              
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                Apply Filters
              </button>
            </div>
          </form>
        </div>
      )}
      
      {error && (
        <div className="alert alert--error">{error}</div>
      )}
      
      <div className="admin-card">
        <div className="admin-card__body">
          {isLoading && usersData.users.length === 0 ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading users...</p>
            </div>
          ) : usersData.users.length === 0 ? (
            <div className="admin-users__empty">
              <FaUser size={48} />
              <p>No users found. Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Spotify</th>
                      <th>Registered</th>
                      <th>Last Active</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersData.users.map(user => (
                      <tr key={user._id}>
                        <td>
                          <div className="admin-users__user">
                            <div className="admin-users__avatar">
                              {user.avatar ? (
                                <img 
                                  src={user.avatar} 
                                  alt={user.displayName || user.username} 
                                  className="admin-users__avatar-img" 
                                />
                              ) : (
                                <FaUser />
                              )}
                            </div>
                            <div className="admin-users__name">
                              <div>{user.displayName || user.username}</div>
                              <div className="admin-users__username">@{user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`admin-users__badge ${user.role === 'admin' ? 'admin-users__badge--admin' : ''}`}>
                            {user.role === 'admin' ? (
                              <>
                                <FaUserShield className="admin-users__badge-icon" />
                                Admin
                              </>
                            ) : 'User'}
                          </span>
                        </td>
                        <td>
                          <span className={`admin-users__badge ${user.spotifyConnected ? 'admin-users__badge--connected' : 'admin-users__badge--disconnected'}`}>
                            {user.spotifyConnected ? 'Connected' : 'Not Connected'}
                          </span>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>{new Date(user.lastActive).toLocaleString()}</td>
                        <td>
                          <div className="admin-users__actions-cell">
                            <button
                              className="btn btn-sm btn-secondary mr-sm"
                              aria-label="Edit user"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteUser(user._id)}
                              disabled={deletingUserId === user._id || user.role === 'admin'}
                              aria-label="Delete user"
                            >
                              {deletingUserId === user._id ? (
                                <div className="spinner spinner--sm"></div>
                              ) : (
                                <FaTrash size={14} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {renderPagination()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;