// File: /frontend/src/features/admin/components/DashboardChart.jsx
// Dashboard chart component

import { FaChartLine } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';

const DashboardChart = ({ chartData, chartOptions }) => {
  if (!chartData) return null;
  
  return (
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
  );
};

export default DashboardChart;