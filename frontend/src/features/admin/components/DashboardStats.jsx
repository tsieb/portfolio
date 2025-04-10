// File: /frontend/src/features/admin/components/DashboardStats.jsx
// Dashboard stats cards component

import { FaMusic, FaCompactDisc, FaListAlt, FaUserAlt } from 'react-icons/fa';

const DashboardStats = ({ dashboardData }) => {
  return (
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
  );
};

export default DashboardStats;