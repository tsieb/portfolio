// File: /frontend/src/pages/AdminDashboardPage.jsx
// Enhanced admin dashboard page component

import { useAdminDashboard } from '../features/admin/hooks/useAdminDashboard';
import DashboardHeader from '../features/admin/components/DashboardHeader';
import DashboardStats from '../features/admin/components/DashboardStats';
import DashboardChart from '../features/admin/components/DashboardChart';
import RecentTracksTable from '../features/admin/components/RecentTracksTable';
import { FaMusic } from 'react-icons/fa';

const AdminDashboardPage = () => {
  const {
    dashboardData,
    isLoading,
    error,
    isRefreshing,
    fetchDashboardData,
    handleRefreshData,
    prepareChartData
  } = useAdminDashboard();
  
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
        <div className="alert alert--error">{error}</div>
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
      <DashboardHeader 
        onRefresh={handleRefreshData} 
        isRefreshing={isRefreshing} 
      />
      
      <DashboardStats dashboardData={dashboardData} />
      
      <DashboardChart chartData={chartData} chartOptions={chartOptions} />
      
      <div className="admin-card">
        <div className="admin-card__header">
          <h2 className="admin-card__title">
            <FaMusic className="admin-card__icon" />
            Recent Tracks
          </h2>
        </div>
        <div className="admin-card__body">
          <RecentTracksTable recentTracks={dashboardData?.recentTracks} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;