// File: /frontend/src/features/admin/hooks/useAdminDashboard.js
// Custom hook for admin dashboard functionality

import { useState, useEffect, useCallback } from 'react';
import { showToast } from '../../../config/toast';
import adminService from '../../../services/admin';
import spotifyService from '../../spotify/services/spotifyApi';

export const useAdminDashboard = () => {
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
  const prepareChartData = useCallback(() => {
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
  }, [dashboardData]);

  return {
    dashboardData,
    isLoading,
    error,
    isRefreshing,
    fetchDashboardData,
    handleRefreshData,
    prepareChartData
  };
};