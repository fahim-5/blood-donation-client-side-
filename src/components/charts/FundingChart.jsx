// client/src/components/charts/FundingChart.jsx
import { FiDollarSign, FiTrendingUp, FiUsers, FiCalendar, FiPieChart, FiBarChart2 } from 'react-icons/fi';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Sector, LineChart, Line } from 'recharts';
import { useState, useEffect } from 'react';

const FundingChart = ({
  fundingData = [],
  timeRange = 'monthly',
  onTimeRangeChange,
  isLoading = false,
  chartType = 'pie', // 'pie', 'bar', 'line'
  onChartTypeChange
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [summaryData, setSummaryData] = useState({});

  // Default data for demonstration
  const defaultData = [
    { name: 'General Donations', value: 4500, color: '#3b82f6', count: 120 },
    { name: 'Emergency Funds', value: 3200, color: '#ef4444', count: 45 },
    { name: 'Equipment', value: 2800, color: '#10b981', count: 32 },
    { name: 'Awareness Campaigns', value: 1800, color: '#8b5cf6', count: 28 },
    { name: 'Staff Training', value: 1200, color: '#f59e0b', count: 18 },
    { name: 'Research', value: 800, color: '#ec4899', count: 12 },
  ];

  const monthlyData = [
    { month: 'Jan', amount: 2800, donations: 85 },
    { month: 'Feb', amount: 3200, donations: 92 },
    { month: 'Mar', amount: 3800, donations: 105 },
    { month: 'Apr', amount: 4200, donations: 115 },
    { month: 'May', amount: 3900, donations: 108 },
    { month: 'Jun', amount: 4500, donations: 125 },
    { month: 'Jul', amount: 4800, donations: 132 },
    { month: 'Aug', amount: 5100, donations: 145 },
    { month: 'Sep', amount: 4900, donations: 138 },
    { month: 'Oct', amount: 5200, donations: 148 },
    { month: 'Nov', amount: 5800, donations: 165 },
    { month: 'Dec', amount: 6200, donations: 178 },
  ];

  useEffect(() => {
    if (fundingData && fundingData.length > 0) {
      setChartData(fundingData);
    } else {
      setChartData(defaultData);
    }

    // Calculate summary data
    const total = defaultData.reduce((sum, item) => sum + item.value, 0);
    const totalDonations = defaultData.reduce((sum, item) => sum + item.count, 0);
    const averageDonation = totalDonations > 0 ? total / totalDonations : 0;
    const topCategory = defaultData.reduce((max, item) => 
      item.value > max.value ? item : max, 
      { name: 'None', value: 0 }
    );

    setSummaryData({
      total,
      totalDonations,
      averageDonation,
      topCategory: topCategory.name,
      topAmount: topCategory.value
    });
  }, [fundingData]);

  const timeRangeOptions = [
    { value: 'weekly', label: 'Weekly', icon: FiCalendar },
    { value: 'monthly', label: 'Monthly', icon: FiCalendar },
    { value: 'quarterly', label: 'Quarterly', icon: FiCalendar },
    { value: 'yearly', label: 'Yearly', icon: FiCalendar }
  ];

  const chartTypeOptions = [
    { value: 'pie', label: 'Pie Chart', icon: FiPieChart },
    { value: 'bar', label: 'Bar Chart', icon: FiBarChart2 },
    { value: 'line', label: 'Trend Line', icon: FiTrendingUp }
  ];

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="font-bold">
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 12}
          outerRadius={outerRadius + 16}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
          className="font-medium"
        >
          {`$${value.toLocaleString()}`}
        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#666"
          className="text-sm"
        >
          {`${(percent * 100).toFixed(1)}%`}
        </text>
      </g>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900 mb-2">{label || payload[0].name}</p>
          {payload.map((entry, index) => (
            <div key={`tooltip-${index}`} className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: entry.color || entry.fill }}
                />
                <span className="text-sm text-gray-600">{entry.name || entry.dataKey}:</span>
              </div>
              <span className="font-medium text-gray-900 ml-4">
                ${entry.value?.toLocaleString() || entry.payload.amount?.toLocaleString()}
              </span>
            </div>
          ))}
          {payload[0]?.payload?.donations && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                Donations: {payload[0].payload.donations}
              </p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <FiDollarSign className="w-5 h-5 mr-2 text-green-600" />
            Funding Analytics
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Track donations and funding distribution
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
          {/* Chart Type Selector */}
          <div className="flex items-center space-x-2">
            <select
              value={chartType}
              onChange={(e) => onChartTypeChange && onChartTypeChange(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
              disabled={isLoading}
            >
              {chartTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => onTimeRangeChange && onTimeRangeChange(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 mr-3">
              <FiDollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-700">Total Funding</p>
              <p className="text-xl font-bold text-green-900">{formatCurrency(summaryData.total || 0)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mr-3">
              <FiUsers className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-700">Total Donations</p>
              <p className="text-xl font-bold text-blue-900">{summaryData.totalDonations || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 mr-3">
              <FiTrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-purple-700">Average Donation</p>
              <p className="text-xl font-bold text-purple-900">
                {formatCurrency(summaryData.averageDonation || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 mr-3">
              <FiBarChart2 className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-amber-700">Top Category</p>
              <p className="text-xl font-bold text-amber-900">
                {summaryData.topCategory || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Primary Chart */}
        <div className="h-80">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-3"></div>
                <p className="text-gray-600">Loading funding data...</p>
              </div>
            </div>
          ) : (
            <>
              {chartType === 'pie' && chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      activeIndex={activeIndex}
                      activeShape={renderActiveShape}
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      onMouseEnter={onPieEnter}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || '#3b82f6'} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      iconSize={10}
                      formatter={(value) => (
                        <span className="text-sm text-gray-700">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : chartType === 'bar' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
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
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="top"
                      height={36}
                      iconType="circle"
                      iconSize={8}
                    />
                    <Bar 
                      dataKey="amount" 
                      name="Funding Amount" 
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="donations" 
                      name="Number of Donations" 
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : chartType === 'line' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyData}
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
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="top"
                      height={36}
                      iconType="circle"
                      iconSize={8}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      name="Funding Trend" 
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="donations" 
                      name="Donations Trend" 
                      stroke="#3b82f6"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FiDollarSign className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-2">No funding data available</p>
                  <p className="text-sm text-gray-500 text-center">
                    Funding statistics will appear here once data is available
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="h-80 overflow-y-auto">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center">
            <FiPieChart className="w-4 h-4 mr-2 text-gray-500" />
            Category Breakdown
          </h4>
          
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : chartData.length > 0 ? (
            <div className="space-y-3">
              {chartData.map((item, index) => {
                const percentage = ((item.value / summaryData.total) * 100).toFixed(1);
                return (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium text-gray-900">{item.name}</span>
                      </div>
                      <span className="font-bold text-gray-900">{formatCurrency(item.value)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>{percentage}% of total</span>
                      <span>{item.count} donations</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: item.color
                        }}
                      />
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500">
                      Avg: {formatCurrency(item.count > 0 ? item.value / item.count : 0)} per donation
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <p className="text-gray-600">No category data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Insights & Trends */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-4 flex items-center">
          <FiTrendingUp className="w-4 h-4 mr-2 text-gray-500" />
          Funding Insights
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700 mb-1">
              <span className="font-medium">Monthly Growth:</span> 12.5%
            </p>
            <p className="text-xs text-blue-600">
              Funding has been steadily increasing month-over-month
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-700 mb-1">
              <span className="font-medium">Donor Retention:</span> 78%
            </p>
            <p className="text-xs text-green-600">
              High percentage of recurring donors
            </p>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-700 mb-1">
              <span className="font-medium">Peak Donation Time:</span> 6-9 PM
            </p>
            <p className="text-xs text-purple-600">
              Most donations occur in the evening
            </p>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium">
              Export as PDF
            </button>
            <button className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
              Share Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundingChart;