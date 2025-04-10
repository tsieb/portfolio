// File: /frontend/src/features/admin/components/DashboardHeader.jsx
// Dashboard header component with refresh button

import { FaSyncAlt } from 'react-icons/fa';

const DashboardHeader = ({ onRefresh, isRefreshing }) => {
  return (
    <div className="admin-dashboard__header">
      <h1 className="admin-dashboard__title">Dashboard</h1>
      <button 
        className="btn btn-primary"
        onClick={onRefresh}
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
  );
};

export default DashboardHeader;