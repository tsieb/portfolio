// File: /frontend/src/pages/AdminDashboardPage.jsx
// Admin dashboard page component

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaMusic, FaListAlt, FaUserAlt, FaCompactDisc } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import adminService from '../services/admin';
import spotifyService from '../services/spotify';
import './AdminDashboardPage.scss';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Admin dashboard page component
 * Displays overview statistics and recent activity
 */
const AdminDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await adminService.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      setError('Failed to fetch dashboard data. Please try again.');
      toast.error('Error loading dashboard data');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Refresh Spotify data
  const handleRefreshData = async () => {
    setIsRefreshing(true);
    
    try {
      await spotifyService.refreshData();
      await fetchDashboardData();
      toast.success('Spotify data refreshed successfully');
    } catch (err) {
      toast.error('Failed to refresh Spotify data');
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  // Prepare chart data if available
  const prepareChartData = () => {
    if (!dashboardData?.listeningTrends) return null;
    
    return {
      labels: dashboardData.listeningTrends.map(item => item._id),
      datasets: [
        {
          label: 'Tracks Played',
          data: dashboardData.listeningTrends.map(item => item.count),
          borderColor: 'rgba(29, 185, 84, 1)',
          backgroundColor: 'rgba(29, 185, 84, 0.5)',
          tension: 0.1
        }
      ]
    };
  };
  
  const chartData = prepareChartData();
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Listening Activity (Last 14 Days)',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="alert alert-danger">{error}</div>
        <button 
          className="btn btn-primary" 
          onClick={fetchDashboardData}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <h1 className="admin-dashboard__title">Dashboard</h1>
        <button 
          className="btn btn-primary"
          onClick={handleRefreshData}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <>
              <div className="spinner spinner--sm mr-sm"></div>
              Refreshing...
            </>
          ) : (
            'Refresh Data'
          )}
        </button>
      </div>
      
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon">
            <FaMusic />
          </div>
          <div className="admin-stat-card__title">Total Tracks</div>
          <div className="admin-stat-card__value">
            {dashboardData?.trackCount || 0}
          </div>
        </div>
        
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon">
            <FaCompactDisc />
          </div>
          <div className="admin-stat-card__title">Top Artist</div>
          <div className="admin-stat-card__value">
            {dashboardData?.listeningStats?.topArtists?.[0]?._id || 'N/A'}
          </div>
        </div>
        
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon">
            <FaListAlt />
          </div>
          <div className="admin-stat-card__title">Top Track</div>
          <div className="admin-stat-card__value">
            {dashboardData?.listeningStats?.topTracks?.[0]?._id?.name || 'N/A'}
          </div>
        </div>
        
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon">
            <FaUserAlt />
          </div>
          <div className="admin-stat-card__title">User Count</div>
          <div className="admin-stat-card__value">
            {dashboardData?.userCount || 0}
          </div>
        </div>
      </div>
      
      {chartData && (
        <div className="admin-card">
          <div className="admin-card__header">
            <h2 className="admin-card__title">Listening Trends</h2>
          </div>
          <div className="admin-card__body">
            <div className="admin-chart">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      )}
      
      <div className="admin-card">
        <div className="admin-card__header">
          <h2 className="admin-card__title">Recent Tracks</h2>
        </div>
        <div className="admin-card__body">
          {dashboardData?.recentTracks?.length > 0 ? (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Track</th>
                    <th>Artist</th>
                    <th>Album</th>
                    <th>Played At</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentTracks.map(track => (
                    <tr key={track._id}>
                      <td>{track.trackName}</td>
                      <td>{track.artistName}</td>
                      <td>{track.albumName}</td>
                      <td>{new Date(track.playedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="admin-card__empty">No recent tracks found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;