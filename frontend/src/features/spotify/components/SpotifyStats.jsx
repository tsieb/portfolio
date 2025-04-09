// File: /frontend/src/features/spotify/components/SpotifyStats.jsx
// Spotify stats component to display listening statistics

import { useEffect } from 'react';
import { useSpotify } from '../../../hooks/useSpotify';
import { FaChartBar, FaMicrophone, FaCompactDisc } from 'react-icons/fa';
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
import './SpotifyStats.scss';

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
  
  if (isLoading) {
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
  
  // Prepare chart data for activity by hour
  const activityData = {
    labels: stats.activityByHour?.map(hour => `${hour._id}:00`) || [],
    datasets: [
      {
        label: 'Tracks Played',
        data: stats.activityByHour?.map(hour => hour.count) || [],
        backgroundColor: 'rgba(29, 185, 84, 0.7)',
        borderColor: 'rgba(29, 185, 84, 1)',
        borderWidth: 1,
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
        color: '#333333',
        font: {
          size: 14,
          weight: '600',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
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
            <span className="spotify-stats__total-label">Total Tracks</span>
            <span className="spotify-stats__total-value">{stats.totalTracks}</span>
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