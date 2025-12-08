// client/src/components/charts/DonationStatsChart.jsx
import { FiTrendingUp, FiUsers, FiDroplet, FiCalendar } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useState, useEffect } from 'react';

const DonationStatsChart = ({
  data = [],
  timeRange = 'monthly',
  onTimeRangeChange,
  isLoading = false,
  showLegend = true
}) => {
  const [chartData, setChartData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  // Default data if no data provided
  const defaultData = [
    { name: 'Jan', donations: 45, requests: 32, completed: 28 },
    { name: 'Feb', donations: 52, requests: 38, completed: 35 },
    { name: 'Mar', donations: 48, requests: 35, completed: 30 },
    { name: 'Apr', donations: 60, requests: 42, completed: 38 },
    { name: 'May', donations: 55, requests: 40, completed: 36 },
    { name: 'Jun', donations: 65, requests: 48, completed: 42 },
  ];

  useEffect(() => {
    if (data && data.length > 0) {
      setChartData(data);
    } else {
      setChartData(defaultData);
    }
  }, [data]);

  const timeRangeOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const handleBarClick = (data, index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={`tooltip-${index}`} className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600">{entry.name}:</span>
              </div>
              <span className="font-medium text-gray-900 ml-4">{entry.value}</span>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Total: {payload.reduce((sum, entry) => sum + entry.value, 0)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const getTotalStats = () => {
    const totals = chartData.reduce((acc, item) => ({
      donations: acc.donations + (item.donations || 0),
      requests: acc.requests + (item.requests || 0),
      completed: acc.completed + (item.completed || 0)
    }), { donations: 0, requests: 0, completed: 0 });

    return totals;
  };

  const totalStats = getTotalStats();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <FiTrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Donation Statistics
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Overview of donations and requests over time
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="mt-4 sm:mt-0">
          <div className="flex items-center space-x-2">
            <FiCalendar className="w-4 h-4 text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => onTimeRangeChange && onTimeRangeChange(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              disabled={isLoading}
            >
              {timeRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mr-3">
              <FiDroplet className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-700">Total Donations</p>
              <p className="text-2xl font-bold text-blue-900">{totalStats.donations}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 mr-3">
              <FiUsers className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-700">Total Requests</p>
              <p className="text-2xl font-bold text-green-900">{totalStats.requests}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 mr-3">
              <FiTrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-purple-700">Completed</p>
              <p className="text-2xl font-bold text-purple-900">{totalStats.completed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
              <p className="text-gray-600">Loading chart data...</p>
            </div>
          </div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              onClick={(data) => {
                if (data && data.activePayload) {
                  handleBarClick(data.activePayload[0].payload, data.activeTooltipIndex);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                label={{ 
                  value: 'Count', 
                  angle: -90, 
                  position: 'insideLeft',
                  offset: -10,
                  style: { fill: '#6b7280' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && (
                <Legend 
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ paddingBottom: '20px' }}
                />
              )}
              <Bar 
                dataKey="donations" 
                name="Donations" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                onClick={(data, index) => handleBarClick(data, index)}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === activeIndex ? '#1d4ed8' : '#3b82f6'}
                    stroke={index === activeIndex ? '#1d4ed8' : '#3b82f6'}
                    strokeWidth={index === activeIndex ? 2 : 1}
                    opacity={activeIndex === null || index === activeIndex ? 1 : 0.7}
                  />
                ))}
              </Bar>
              <Bar 
                dataKey="requests" 
                name="Requests" 
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                onClick={(data, index) => handleBarClick(data, index)}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === activeIndex ? '#059669' : '#10b981'}
                    stroke={index === activeIndex ? '#059669' : '#10b981'}
                    strokeWidth={index === activeIndex ? 2 : 1}
                    opacity={activeIndex === null || index === activeIndex ? 1 : 0.7}
                  />
                ))}
              </Bar>
              <Bar 
                dataKey="completed" 
                name="Completed" 
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
                onClick={(data, index) => handleBarClick(data, index)}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === activeIndex ? '#7c3aed' : '#8b5cf6'}
                    stroke={index === activeIndex ? '#7c3aed' : '#8b5cf6'}
                    strokeWidth={index === activeIndex ? 2 : 1}
                    opacity={activeIndex === null || index === activeIndex ? 1 : 0.7}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiTrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-2">No data available</p>
            <p className="text-sm text-gray-500 text-center">
              Donation statistics will appear here once data is available
            </p>
          </div>
        )}
      </div>

      {/* Chart Insights */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <FiTrendingUp className="w-4 h-4 mr-2 text-gray-500" />
          Insights
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Highest Month:</span>{' '}
              {chartData.reduce((max, item) => 
                item.donations > max.donations ? item : max, 
                { name: 'N/A', donations: 0 }
              ).name}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Completion Rate:</span>{' '}
              {totalStats.requests > 0 
                ? `${((totalStats.completed / totalStats.requests) * 100).toFixed(1)}%`
                : '0%'
              }
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Avg Monthly:</span>{' '}
              {chartData.length > 0 
                ? Math.round(totalStats.donations / chartData.length)
                : 0
              } donations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};



export default DonationStatsChart;