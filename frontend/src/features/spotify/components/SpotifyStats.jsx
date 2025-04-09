// File: /frontend/src/features/spotify/components/SpotifyStats.jsx
// Enhanced Spotify stats component with improved visuals

import { useEffect } from 'react';
import { useSpotify } from '../hooks/useSpotify';
import { FaChartBar, FaMicrophone, FaCompactDisc, FaHeadphones, FaMusic } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import '../../../assets/styles/features/spotify/components/SpotifyStats.scss';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Enhanced component to display Spotify listening statistics
 * with improved visuals
 */
const SpotifyStats = () => {
  const { 
    stats, 
    isLoading, 
    error, 
    fetchStats 
  } = useSpotify();
  
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);
  
  if (isLoading && !stats) {
    return (
      <div className="spotify-stats">
        <div className="spotify-stats__header">
          <h2 className="spotify-stats__title">
            <FaChartBar className="spotify-stats__icon" />
            Listening Stats
          </h2>
        </div>
        <div className="spotify-stats__loading">
          <div className="spinner"></div>
          <span>Loading statistics...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="spotify-stats">
        <div className="spotify-stats__header">
          <h2 className="spotify-stats__title">
            <FaChartBar className="spotify-stats__icon" />
            Listening Stats
          </h2>
        </div>
        <div className="spotify-stats__error">
          <FaChartBar size={24} />
          <p>Unable to fetch listening statistics.</p>
        </div>
      </div>
    );
  }
  
  if (!stats) {
    return (
      <div className="spotify-stats">
        <div className="spotify-stats__header">
          <h2 className="spotify-stats__title">
            <FaChartBar className="spotify-stats__icon" />
            Listening Stats
          </h2>
        </div>
        <div className="spotify-stats__empty">
          <FaChartBar size={24} />
          <p>No listening statistics available yet.</p>
        </div>
      </div>
    );
  }
  
  // Prepare chart data for activity by hour with gradient background
  const activityData = {
    labels: stats.activityByHour?.map(hour => `${hour._id}:00`) || [],
    datasets: [
      {
        label: 'Tracks Played',
        data: stats.activityByHour?.map(hour => hour.count) || [],
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          
          if (!chartArea) {
            // This case happens on initial chart load
            return 'rgba(30, 215, 96, 0.7)';
          }
          
          // Create gradient
          const gradient = ctx.createLinearGradient(0, 0, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(30, 215, 96, 0.8)');
          gradient.addColorStop(1, 'rgba(30, 215, 96, 0.2)');
          return gradient;
        },
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Listening Activity by Hour',
        color: 'rgba(255, 255, 255, 0.8)',
        font: {
          size: 14,
          weight: '600',
        },
        padding: {
          top: 10,
          bottom: 20
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
            return `${tooltipItems[0].label}`;
          },
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return `${value} ${value === 1 ? 'track' : 'tracks'}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          precision: 0,
          color: 'rgba(255, 255, 255, 0.6)',
        },
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    }
  };
  
  return (
    <div className="spotify-stats">
      <div className="spotify-stats__header">
        <h2 className="spotify-stats__title">
          <FaChartBar className="spotify-stats__icon" />
          Listening Stats
        </h2>
      </div>
      
      <div className="spotify-stats__content">
        <div className="spotify-stats__summary">
          <div className="spotify-stats__total">
            <FaHeadphones className="spotify-stats__total-icon" />
            <span className="spotify-stats__total-value">{stats.totalTracks}</span>
            <span className="spotify-stats__total-label">Total Tracks</span>
          </div>
        </div>
        
        <div className="spotify-stats__sections">
          <div className="spotify-stats__section">
            <h3 className="spotify-stats__section-title">
              <FaMicrophone className="spotify-stats__section-icon" />
              Top Artists
            </h3>
            {stats.topArtists && stats.topArtists.length > 0 ? (
              <ul className="spotify-stats__list">
                {stats.topArtists.map((artist, index) => (
                  <li key={artist._id} className="spotify-stats__list-item">
                    <span className="spotify-stats__list-rank">{index + 1}</span>
                    <span className="spotify-stats__list-name">{artist._id}</span>
                    <div className="spotify-stats__list-bar-container">
                      <div 
                        className="spotify-stats__list-bar" 
                        style={{ 
                          width: `${Math.min(100, (artist.count / stats.topArtists[0].count) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <span className="spotify-stats__list-count">{artist.count} plays</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="spotify-stats__empty-message">No top artists data available.</p>
            )}
          </div>
          
          <div className="spotify-stats__section">
            <h3 className="spotify-stats__section-title">
              <FaCompactDisc className="spotify-stats__section-icon" />
              Top Tracks
            </h3>
            {stats.topTracks && stats.topTracks.length > 0 ? (
              <ul className="spotify-stats__list">
                {stats.topTracks.map((track, index) => (
                  <li key={track._id.trackId} className="spotify-stats__list-item">
                    <span className="spotify-stats__list-rank">{index + 1}</span>
                    <span className="spotify-stats__list-name">{track._id.name}</span>
                    <div className="spotify-stats__list-bar-container">
                      <div 
                        className="spotify-stats__list-bar spotify-stats__list-bar--alt" 
                        style={{ 
                          width: `${Math.min(100, (track.count / stats.topTracks[0].count) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <span className="spotify-stats__list-count">{track.count} plays</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="spotify-stats__empty-message">No top tracks data available.</p>
            )}
          </div>
        </div>
        
        <div className="spotify-stats__chart">
          <div className="spotify-stats__chart-container">
            <Bar data={activityData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotifyStats;