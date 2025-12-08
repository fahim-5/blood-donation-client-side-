// client/src/components/charts/MonthlyDonationsChart.jsx
import { FiCalendar, FiTrendingUp, FiUsers, FiDroplet, FiBarChart2, FiFilter } from 'react-icons/fi';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { useState, useEffect } from 'react';

const MonthlyDonationsChart = ({
  data = [],
  year = new Date().getFullYear(),
  onYearChange,
  isLoading = false,
  viewType = 'combined', // 'donations', 'requests', 'completed', 'combined'
  onViewTypeChange,
  showComparison = false,
  onComparisonToggle
}) => {
  const [chartData, setChartData] = useState([]);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  // Default data for demonstration
  const defaultData = [
    { 
      month: 'Jan', 
      donations: 42, 
      requests: 38, 
      completed: 35, 
      pending: 3,
      cancelled: 2,
      bloodTypeDistribution: { 'A+': 12, 'B+': 8, 'O+': 15, 'AB+': 7 }
    },
    { 
      month: 'Feb', 
      donations: 48, 
      requests: 45, 
      completed: 42, 
      pending: 3,
      cancelled: 2,
      bloodTypeDistribution: { 'A+': 14, 'B+': 10, 'O+': 16, 'AB+': 8 }
    },
    { 
      month: 'Mar', 
      donations: 52, 
      requests: 48, 
      completed: 46, 
      pending: 2,
      cancelled: 2,
      bloodTypeDistribution: { 'A+': 15, 'B+': 12, 'O+': 18, 'AB+': 7 }
    },
    { 
      month: 'Apr', 
      donations: 45, 
      requests: 42, 
      completed: 40, 
      pending: 2,
      cancelled: 2,
      bloodTypeDistribution: { 'A+': 13, 'B+': 10, 'O+': 16, 'AB+': 6 }
    },
    { 
      month: 'May', 
      donations: 58, 
      requests: 52, 
      completed: 50, 
      pending: 2,
      cancelled: 2,
      bloodTypeDistribution: { 'A+': 16, 'B+': 14, 'O+': 20, 'AB+': 8 }
    },
    { 
      month: 'Jun', 
      donations: 62, 
      requests: 58, 
      completed: 56, 
      pending: 2,
      cancelled: 2,
      bloodTypeDistribution: { 'A+': 18, 'B+': 15, 'O+': 21, 'AB+': 8 }
    },
    { 
      month: 'Jul', 
      donations: 55, 
      requests: 50, 
      completed: 48, 
      pending: 2,
      cancelled: 2,
      bloodTypeDistribution: { 'A+': 16, 'B+': 12, 'O+': 19, 'AB+': 8 }
    },
    { 
      month: 'Aug', 
      donations: 65, 
      requests: 60, 
      completed: 58, 
      pending: 2,
      cancelled: 2,
      bloodTypeDistribution: { 'A+': 19, 'B+': 16, 'O+': 22, 'AB+': 8 }
    },
    { 
      month: 'Sep', 
      donations: 70, 
      requests: 65, 
      completed: 63, 
      pending: 2,
      cancelled: 2,
      bloodTypeDistribution: { 'A+': 20, 'B+': 18, 'O+': 24, 'AB+': 8 }
    },
    { 
      month: 'Oct', 
      donations: 68, 
      requests: 62, 
      completed: 60, 
      pending: 2,
      cancelled: 2,
      bloodTypeDistribution: { 'A+': 19, 'B+': 17, 'O+': 24, 'AB+': 8 }
    },
    { 
      month: 'Nov', 
      donations: 72, 
      requests: 68, 
      completed: 66, 
      pending: 2,
      cancelled: 2,
      bloodTypeDistribution: { 'A+': 21, 'B+': 19, 'O+': 24, 'AB+': 8 }
    },
    { 
      month: 'Dec', 
      donations: 80, 
      requests: 75, 
      completed: 73, 
      pending: 2,
      cancelled: 2,
      bloodTypeDistribution: { 'A+': 23, 'B+': 21, 'O+': 28, 'AB+': 8 }
    },
  ];

  const previousYearData = [
    { month: 'Jan', donations: 35, requests: 32, completed: 30 },
    { month: 'Feb', donations: 40, requests: 38, completed: 36 },
    { month: 'Mar', donations: 45, requests: 42, completed: 40 },
    { month: 'Apr', donations: 38, requests: 35, completed: 33 },
    { month: 'May', donations: 50, requests: 46, completed: 44 },
    { month: 'Jun', donations: 55, requests: 50, completed: 48 },
    { month: 'Jul', donations: 48, requests: 45, completed: 42 },
    { month: 'Aug', donations: 58, requests: 54, completed: 52 },
    { month: 'Sep', donations: 62, requests: 58, completed: 56 },
    { month: 'Oct', donations: 60, requests: 56, completed: 54 },
    { month: 'Nov', donations: 65, requests: 60, completed: 58 },
    { month: 'Dec', donations: 72, requests: 68, completed: 66 },
  ];

  useEffect(() => {
    if (data && data.length > 0) {
      setChartData(data);
    } else {
      setChartData(defaultData);
    }
  }, [data]);

  const years = [2022, 2023, 2024, 2025];
  const viewTypeOptions = [
    { value: 'combined', label: 'Combined View', color: '#3b82f6' },
    { value: 'donations', label: 'Donations Only', color: '#10b981' },
    { value: 'requests', label: 'Requests Only', color: '#8b5cf6' },
    { value: 'completed', label: 'Completed Only', color: '#f59e0b' }
  ];

  const getTotals = () => {
    return chartData.reduce((acc, month) => ({
      donations: acc.donations + month.donations,
      requests: acc.requests + month.requests,
      completed: acc.completed + month.completed,
      pending: acc.pending + month.pending,
      cancelled: acc.cancelled + month.cancelled
    }), { donations: 0, requests: 0, completed: 0, pending: 0, cancelled: 0 });
  };

  const getMonthlyGrowth = () => {
    if (chartData.length < 2) return 0;
    const lastMonth = chartData[chartData.length - 1];
    const secondLastMonth = chartData[chartData.length - 2];
    return ((lastMonth.donations - secondLastMonth.donations) / secondLastMonth.donations) * 100;
  };

  const getCompletionRate = () => {
    const totals = getTotals();
    return totals.requests > 0 ? (totals.completed / totals.requests) * 100 : 0;
  };

  const getAverageMonthly = () => {
    const totals = getTotals();
    return {
      donations: Math.round(totals.donations / chartData.length),
      requests: Math.round(totals.requests / chartData.length),
      completed: Math.round(totals.completed / chartData.length)
    };
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const monthData = chartData.find(m => m.month === label);
      
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200 min-w-64">
          <p className="font-bold text-gray-900 mb-3 text-center">{label} {year}</p>
          
          <div className="space-y-2">
            {payload.map((entry, index) => (
              <div key={`tooltip-${index}`} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: entry.color || entry.fill }}
                  />
                  <span className="text-sm text-gray-700">{entry.name}:</span>
                </div>
                <span className="font-bold text-gray-900">{entry.value}</span>
              </div>
            ))}
          </div>
          
          {monthData && (
            <>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600">Pending:</div>
                  <div className="font-medium text-right">{monthData.pending}</div>
                  <div className="text-gray-600">Cancelled:</div>
                  <div className="font-medium text-right">{monthData.cancelled}</div>
                  <div className="text-gray-600">Completion:</div>
                  <div className="font-medium text-right">
                    {monthData.requests > 0 
                      ? `${((monthData.completed / monthData.requests) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </div>
                </div>
              </div>
              
              {/* Blood Type Distribution */}
              {monthData.bloodTypeDistribution && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Blood Type Distribution:</p>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    {Object.entries(monthData.bloodTypeDistribution).map(([type, count]) => (
                      <div key={type} className="flex justify-between">
                        <span className="text-gray-600">{type}:</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const chartConfig = {
      combined: {
        type: 'BarChart',
        dataKey: ['donations', 'requests', 'completed'],
        colors: ['#10b981', '#8b5cf6', '#f59e0b']
      },
      donations: {
        type: 'AreaChart',
        dataKey: ['donations'],
        colors: ['#10b981']
      },
      requests: {
        type: 'AreaChart',
        dataKey: ['requests'],
        colors: ['#8b5cf6']
      },
      completed: {
        type: 'AreaChart',
        dataKey: ['completed'],
        colors: ['#f59e0b']
      }
    };

    const config = chartConfig[viewType];
    
    if (config.type === 'BarChart') {
      return (
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          onMouseMove={(data) => {
            if (data && data.activeTooltipIndex !== undefined) {
              setHoveredBar(data.activeTooltipIndex);
            }
          }}
          onMouseLeave={() => setHoveredBar(null)}
          onClick={(data) => {
            if (data && data.activeLabel) {
              setSelectedMonth(data.activeLabel);
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="month" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top"
            height={36}
            iconType="circle"
            iconSize={8}
          />
          
          {config.dataKey.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              name={key.charAt(0).toUpperCase() + key.slice(1)}
              fill={config.colors[index]}
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            >
              {chartData.map((entry, barIndex) => (
                <Cell
                  key={`cell-${barIndex}`}
                  fill={barIndex === hoveredBar ? 
                    `${config.colors[index]}CC` : config.colors[index]
                  }
                  stroke={barIndex === selectedMonth ? config.colors[index] : 'none'}
                  strokeWidth={barIndex === selectedMonth ? 2 : 0}
                />
              ))}
            </Bar>
          ))}
        </BarChart>
      );
    } else {
      return (
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="month" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top"
            height={36}
            iconType="circle"
            iconSize={8}
          />
          
          {config.dataKey.map((key, index) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              name={key.charAt(0).toUpperCase() + key.slice(1)}
              stroke={config.colors[index]}
              fill={config.colors[index]}
              fillOpacity={0.2}
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </AreaChart>
      );
    }
  };

  const totals = getTotals();
  const monthlyGrowth = getMonthlyGrowth();
  const completionRate = getCompletionRate();
  const averages = getAverageMonthly();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <FiCalendar className="w-5 h-5 mr-2 text-blue-600" />
            Monthly Donations Analysis
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Track donation patterns and trends over time
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
          {/* Year Selector */}
          <div className="flex items-center space-x-2">
            <FiCalendar className="w-4 h-4 text-gray-400" />
            <select
              value={year}
              onChange={(e) => onYearChange && onYearChange(parseInt(e.target.value))}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              disabled={isLoading}
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* View Type Selector */}
          <div className="flex items-center space-x-2">
            <FiFilter className="w-4 h-4 text-gray-400" />
            <select
              value={viewType}
              onChange={(e) => onViewTypeChange && onViewTypeChange(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              disabled={isLoading}
            >
              {viewTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Comparison Toggle */}
          <button
            onClick={() => onComparisonToggle && onComparisonToggle(!showComparison)}
            className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors ${
              showComparison
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'border-gray-300 text-gray-700 hover:border-blue-300'
            }`}
            disabled={isLoading}
          >
            Compare Years
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Total Donations</p>
              <p className="text-2xl font-bold text-green-900">{totals.donations}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
              <FiDroplet className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-green-600">
            {averages.donations} avg/month • {monthlyGrowth > 0 ? '↗' : '↘'} {Math.abs(monthlyGrowth).toFixed(1)}% vs last month
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700">Total Requests</p>
              <p className="text-2xl font-bold text-purple-900">{totals.requests}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100">
              <FiUsers className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-purple-600">
            {averages.requests} avg/month • {totals.pending} pending
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-700">Completion Rate</p>
              <p className="text-2xl font-bold text-amber-900">{completionRate.toFixed(1)}%</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100">
              <FiTrendingUp className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-amber-600">
            {totals.completed} completed • {totals.cancelled} cancelled
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700">Monthly Average</p>
              <p className="text-2xl font-bold text-blue-900">{averages.donations}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
              <FiBarChart2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-blue-600">
            Donations per month • Peak: {Math.max(...chartData.map(m => m.donations))}
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="h-80 mb-6">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
              <p className="text-gray-600">Loading donation data...</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        )}
      </div>

      {/* Comparison Chart (if enabled) */}
      {showComparison && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center">
            <FiTrendingUp className="w-4 h-4 mr-2 text-gray-500" />
            Year-over-Year Comparison
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip />
                <Legend 
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                />
                <Line
                  type="monotone"
                  data={defaultData}
                  dataKey="donations"
                  name={`${year} Donations`}
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  data={previousYearData}
                  dataKey="donations"
                  name={`${year - 1} Donations`}
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Monthly Breakdown */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-4 flex items-center">
          <FiBarChart2 className="w-4 h-4 mr-2 text-gray-500" />
          Monthly Performance Breakdown
        </h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Month</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Donations</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Requests</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Completed</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Pending</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Cancelled</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Rate</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {chartData.map((month, index) => {
                const rate = month.requests > 0 ? (month.completed / month.requests) * 100 : 0;
                const isSelected = selectedMonth === month.month;
                
                return (
                  <tr 
                    key={index}
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedMonth(month.month)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{month.month}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-bold text-green-700">{month.donations}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-purple-700">{month.requests}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-amber-700">{month.completed}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-blue-700">{month.pending}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-red-700">{month.cancelled}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className={`font-medium ${
                        rate >= 90 ? 'text-green-700' :
                        rate >= 75 ? 'text-amber-700' : 'text-red-700'
                      }`}>
                        {rate.toFixed(1)}%
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-4">Key Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700 mb-1">
              <span className="font-medium">Peak Month:</span> December
            </p>
            <p className="text-xs text-blue-600">
              Highest donations occur during holiday season
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-700 mb-1">
              <span className="font-medium">Best Performance:</span> 96.7% completion
            </p>
            <p className="text-xs text-green-600">
              March achieved the highest completion rate
            </p>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-700 mb-1">
              <span className="font-medium">Most Common Type:</span> O+
            </p>
            <p className="text-xs text-purple-600">
              O+ blood type accounts for 32% of all donations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyDonationsChart;