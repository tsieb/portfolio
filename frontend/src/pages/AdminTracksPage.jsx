// File: /frontend/src/pages/AdminTracksPage.jsx
// Admin tracks page component

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaSearch, FaFilter, FaMusic, FaTrash } from 'react-icons/fa';
import adminService from '../services/admin';

/**
 * Admin tracks page component
 * Displays a list of all tracks with filtering, sorting, and pagination
 */
const AdminTracksPage = () => {
  // State for tracks data
  const [tracksData, setTracksData] = useState({
    tracks: [],
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
    artist: '',
    track: '',
    album: '',
    startDate: '',
    endDate: '',
    sort: 'playedAt',
    order: 'desc',
    page: 1,
    limit: 20
  });
  
  // State for filter visibility
  const [showFilters, setShowFilters] = useState(false);
  
  // State for track being deleted
  const [deletingTrackId, setDeletingTrackId] = useState(null);
  
  // Fetch tracks data
  const fetchTracks = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await adminService.getTracks(filters);
      setTracksData(data);
    } catch (err) {
      setError('Failed to fetch tracks. Please try again.');
      toast.error('Error loading tracks');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      // Reset to page 1 when filters change
      page: name === 'page' ? value : 1
    }));
  };
  
  // Handle filter submit
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchTracks();
  };
  
  // Handle filter reset
  const handleFilterReset = () => {
    setFilters({
      artist: '',
      track: '',
      album: '',
      startDate: '',
      endDate: '',
      sort: 'playedAt',
      order: 'desc',
      page: 1,
      limit: 20
    });
  };
  
  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > tracksData.pagination.pages) return;
    
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };
  
  // Handle track deletion
  const handleDeleteTrack = async (trackId) => {
    if (!confirm('Are you sure you want to delete this track?')) return;
    
    setDeletingTrackId(trackId);
    
    try {
      await adminService.deleteTrack(trackId);
      toast.success('Track deleted successfully');
      fetchTracks(); // Refresh the list
    } catch (err) {
      toast.error('Failed to delete track');
    } finally {
      setDeletingTrackId(null);
    }
  };
  
  // Fetch tracks on component mount and when filters change
  useEffect(() => {
    fetchTracks();
  }, [filters.page, filters.limit, filters.sort, filters.order]);
  
  // Generate pagination controls
  const renderPagination = () => {
    const { page, pages, total } = tracksData.pagination;
    
    // Calculate start and end items
    const start = (page - 1) * filters.limit + 1;
    const end = Math.min(page * filters.limit, total);
    
    return (
      <div className="admin-pagination">
        <div className="admin-pagination__info">
          Showing {start}-{end} of {total} tracks
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
    <div className="admin-tracks">
      <div className="admin-tracks__header">
        <h1 className="admin-tracks__title">Spotify Tracks History</h1>
        
        <div className="admin-tracks__actions">
          <button
            className="btn btn-secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter className="mr-sm" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          
          <button
            className="btn btn-primary"
            onClick={fetchTracks}
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
              <label htmlFor="artist" className="form-label">Artist</label>
              <input
                type="text"
                id="artist"
                name="artist"
                className="form-input"
                value={filters.artist}
                onChange={handleFilterChange}
                placeholder="Filter by artist"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="track" className="form-label">Track</label>
              <input
                type="text"
                id="track"
                name="track"
                className="form-input"
                value={filters.track}
                onChange={handleFilterChange}
                placeholder="Filter by track name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="album" className="form-label">Album</label>
              <input
                type="text"
                id="album"
                name="album"
                className="form-input"
                value={filters.album}
                onChange={handleFilterChange}
                placeholder="Filter by album"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="startDate" className="form-label">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="form-input"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="endDate" className="form-label">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="form-input"
                value={filters.endDate}
                onChange={handleFilterChange}
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
                <option value="playedAt">Played Date</option>
                <option value="trackName">Track Name</option>
                <option value="artistName">Artist Name</option>
                <option value="albumName">Album Name</option>
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
          {isLoading && tracksData.tracks.length === 0 ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading tracks...</p>
            </div>
          ) : tracksData.tracks.length === 0 ? (
            <div className="admin-tracks__empty">
              <FaMusic size={48} />
              <p>No tracks found. Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Track</th>
                      <th>Artist</th>
                      <th>Album</th>
                      <th>Played At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tracksData.tracks.map(track => (
                      <tr key={track._id}>
                        <td>
                          <div className="admin-tracks__track">
                            {track.albumImageUrl && (
                              <img 
                                src={track.albumImageUrl} 
                                alt={`${track.albumName} cover`} 
                                className="admin-tracks__image" 
                              />
                            )}
                            <span>{track.trackName}</span>
                          </div>
                        </td>
                        <td>{track.artistName}</td>
                        <td>{track.albumName}</td>
                        <td>{new Date(track.playedAt).toLocaleString()}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteTrack(track._id)}
                            disabled={deletingTrackId === track._id}
                            aria-label="Delete track"
                          >
                            {deletingTrackId === track._id ? (
                              <div className="spinner spinner--sm"></div>
                            ) : (
                              <FaTrash size={14} />
                            )}
                          </button>
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

export default AdminTracksPage;