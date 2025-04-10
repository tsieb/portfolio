// File: /frontend/src/features/spotify/components/SpotifyStats.jsx
// Component to display Spotify listening statistics

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
 * Component to display Spotify listening statistics
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
      <div className="stats-card">
        <div className="stats-card__header">
          <h2 className="stats-card__title">
            <FaChartBar className="stats-card__icon" />
            Listening Stats
          </h2>
        </div>
        <div className="stats-card__body">
          <div className="loading">
            <div className="spinner"></div>
            <span className="loading__text">Loading statistics...</span>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="stats-card">
        <div className="stats-card__header">
          <h2 className="stats-card__title">
            <FaChartBar className="stats-card__icon" />
            Listening Stats
          </h2>
        </div>
        <div className="stats-card__body">
          <div className="empty-state">
            <FaChartBar className="empty-state__icon" />
            <p className="empty-state__message">Unable to fetch listening statistics.</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!stats) {
    return (
      <div className="stats-card">
        <div className="stats-card__header">
          <h2 className="stats-card__title">
            <FaChartBar className="stats-card__icon" />
            Listening Stats
          </h2>
        </div>
        <div className="stats-card__body">
          <div className="empty-state">
            <FaChartBar className="empty-state__icon" />
            <p className="empty-state__message">No listening statistics available yet.</p>
          </div>
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
    <div className="stats-card">
      <div className="stats-card__header">
        <h2 className="stats-card__title">
          <FaChartBar className="stats-card__icon" />
          Listening Stats
        </h2>
      </div>
      
      <div className="stats-card__body">
        <div className="stats-counter mb-lg">
          <FaHeadphones className="stats-counter__icon" />
          <div className="stats-counter__value">{stats.totalTracks}</div>
          <div className="stats-counter__label">Total Tracks</div>
        </div>
        
        <div className="grid grid--cols-2 mb-xl">
          <div className="grid__item">
            <h3 className="stats-card__title mb-md">
              <FaMicrophone className="stats-card__icon" />
              Top Artists
            </h3>
            {stats.topArtists && stats.topArtists.length > 0 ? (
              <div className="stats-list">
                {stats.topArtists.map((artist, index) => (
                  <div key={artist._id} className="stats-list__item">
                    <div className="stats-list__header">
                      <div className="stats-list__name">{artist._id}</div>
                      <div className="stats-list__value">{artist.count} plays</div>
                    </div>
                    <div className="stats-list__bar-container">
                      <div 
                        className="stats-list__bar" 
                        style={{ 
                          '--percent': `${Math.min(100, (artist.count / stats.topArtists[0].count) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-tertiary">No top artists data available.</p>
            )}
          </div>
          
          <div className="grid__item">
            <h3 className="stats-card__title mb-md">
              <FaCompactDisc className="stats-card__icon" />
              Top Tracks
            </h3>
            {stats.topTracks && stats.topTracks.length > 0 ? (
              <div className="stats-list">
                {stats.topTracks.map((track, index) => (
                  <div key={track._id.trackId} className="stats-list__item">
                    <div className="stats-list__header">
                      <div className="stats-list__name">{track._id.name}</div>
                      <div className="stats-list__value">{track.count} plays</div>
                    </div>
                    <div className="stats-list__bar-container">
                      <div 
                        className="stats-list__bar stats-list__bar--alt" 
                        style={{ 
                          '--percent': `${Math.min(100, (track.count / stats.topTracks[0].count) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-tertiary">No top tracks data available.</p>
            )}
          </div>
        </div>
        
        <div className="chart-container" style={{ height: '300px' }}>
          <Bar data={activityData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default SpotifyStats;