// File: /frontend/src/pages/AdminDashboardPage.jsx
// Enhanced admin dashboard page component

import { useState, useEffect } from 'react';
import { showToast } from '../config/toast';
import { FaMusic, FaListAlt, FaUserAlt, FaCompactDisc, FaSyncAlt, FaChartLine } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import adminService from '../services/admin';
import spotifyService from '../features/spotify/services/spotifyApi';
import '../assets/styles/pages/AdminDashboardPage.scss';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * Enhanced admin dashboard page component
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
      showToast.error('Error loading dashboard data');
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
      showToast.success('Spotify data refreshed successfully');
    } catch (err) {
      showToast.error('Failed to refresh Spotify data');
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
          borderColor: 'rgba(30, 215, 96, 1)',
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 350);
            gradient.addColorStop(0, 'rgba(30, 215, 96, 0.5)');
            gradient.addColorStop(1, 'rgba(30, 215, 96, 0.05)');
            return gradient;
          },
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgba(30, 215, 96, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: 'rgba(30, 215, 96, 1)',
          pointHoverBorderColor: '#fff'
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
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Listening Activity (Last 14 Days)',
        color: 'rgba(255, 255, 255, 0.9)',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(24, 24, 24, 0.9)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.7)',
        borderColor: 'rgba(30, 215, 96, 0.3)',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          title: function(tooltipItems) {
            return `Date: ${tooltipItems[0].label}`;
          },
          label: function(context) {
            return `${context.parsed.y} tracks played`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          color: 'rgba(255, 255, 255, 0.7)'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    }
  };
  
  if (isLoading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-loading">
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
            <>
              <FaSyncAlt className="mr-sm" />
              Refresh Data
            </>
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
            <h2 className="admin-card__title">
              <FaChartLine className="admin-card__icon" />
              Listening Trends
            </h2>
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
          <h2 className="admin-card__title">
            <FaMusic className="admin-card__icon" />
            Recent Tracks
          </h2>
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
                      <td className="admin-track-cell">
                        {track.albumImageUrl && (
                          <img
                            src={track.albumImageUrl}
                            alt={`${track.albumName} cover`}
                            className="admin-track-image"
                          />
                        )}
                        <span>{track.trackName}</span>
                      </td>
                      <td>{track.artistName}</td>
                      <td>{track.albumName}</td>
                      <td>{new Date(track.playedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-empty">
              <FaMusic />
              <p>No recent tracks found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;