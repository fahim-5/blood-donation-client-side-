// client/src/components/charts/UserActivityChart.jsx
import { FiUsers, FiActivity, FiTrendingUp, FiClock, FiCalendar, FiStar, FiAward, FiTarget } from 'react-icons/fi';
import { RadialBarChart, RadialBar, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { useState, useEffect } from 'react';

const UserActivityChart = ({
  data = [],
  timeRange = 'monthly',
  onTimeRangeChange,
  userType = 'all', // 'all', 'donors', 'volunteers', 'admins'
  onUserTypeChange,
  isLoading = false,
  showHeatmap = false,
  onHeatmapToggle
}) => {
  const [chartData, setChartData] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedMetric, setSelectedMetric] = useState('activity'); // 'activity', 'engagement', 'performance'

  // Default data for demonstration
  const defaultUserActivity = [
    { day: 'Mon', activeUsers: 85, newUsers: 12, donations: 25, loginCount: 120 },
    { day: 'Tue', activeUsers: 92, newUsers: 15, donations: 32, loginCount: 135 },
    { day: 'Wed', activeUsers: 88, newUsers: 10, donations: 28, loginCount: 125 },
    { day: 'Thu', activeUsers: 95, newUsers: 18, donations: 35, loginCount: 145 },
    { day: 'Fri', activeUsers: 105, newUsers: 22, donations: 42, loginCount: 165 },
    { day: 'Sat', activeUsers: 98, newUsers: 20, donations: 38, loginCount: 155 },
    { day: 'Sun', activeUsers: 75, newUsers: 8, donations: 22, loginCount: 110 },
  ];

  const userDistribution = [
    { name: 'Active Donors', value: 65, color: '#10b981', icon: FiUsers },
    { name: 'New Users', value: 15, color: '#3b82f6', icon: FiStar },
    { name: 'Volunteers', value: 12, color: '#8b5cf6', icon: FiTarget },
    { name: 'Admins', value: 3, color: '#f59e0b', icon: FiAward },
    { name: 'Inactive', value: 5, color: '#ef4444', icon: FiClock },
  ];

  const userPerformance = [
    { user: 'John D.', donations: 8, responseTime: '2.4h', rating: 4.8, points: 1250 },
    { user: 'Sarah M.', donations: 6, responseTime: '1.8h', rating: 4.9, points: 980 },
    { user: 'Mike R.', donations: 5, responseTime: '3.2h', rating: 4.5, points: 750 },
    { user: 'Lisa K.', donations: 7, responseTime: '2.1h', rating: 4.7, points: 1100 },
    { user: 'David L.', donations: 4, responseTime: '4.5h', rating: 4.3, points: 620 },
    { user: 'Emma W.', donations: 9, responseTime: '1.5h', rating: 4.9, points: 1350 },
  ];

  const engagementMetrics = [
    { metric: 'Avg Session Duration', value: '12m 34s', change: '+8%', icon: FiClock },
    { metric: 'Page Views', value: '45.2K', change: '+15%', icon: FiActivity },
    { metric: 'Return Rate', value: '78%', change: '+5%', icon: FiTrendingUp },
    { metric: 'Feedback Score', value: '4.7/5', change: '+0.2', icon: FiStar },
  ];

  const timeRangeOptions = [
    { value: 'daily', label: 'Daily', icon: FiCalendar },
    { value: 'weekly', label: 'Weekly', icon: FiCalendar },
    { value: 'monthly', label: 'Monthly', icon: FiCalendar },
    { value: 'quarterly', label: 'Quarterly', icon: FiCalendar },
  ];

  const userTypeOptions = [
    { value: 'all', label: 'All Users', color: '#3b82f6' },
    { value: 'donors', label: 'Donors', color: '#10b981' },
    { value: 'volunteers', label: 'Volunteers', color: '#8b5cf6' },
    { value: 'admins', label: 'Admins', color: '#f59e0b' },
  ];

  const metricOptions = [
    { value: 'activity', label: 'Activity', icon: FiActivity },
    { value: 'engagement', label: 'Engagement', icon: FiTrendingUp },
    { value: 'performance', label: 'Performance', icon: FiAward },
  ];

  useEffect(() => {
    if (data && data.length > 0) {
      setChartData(data);
    } else {
      setChartData(defaultUserActivity);
    }

    // Calculate user statistics
    const stats = {
      totalUsers: 325,
      activeUsers: 285,
      newUsersThisWeek: 42,
      avgDonationsPerUser: 3.2,
      userGrowth: 12.5,
      peakActivity: 'Friday, 6-8 PM',
      mostActiveUsers: userPerformance.length,
      totalPoints: userPerformance.reduce((sum, user) => sum + user.points, 0)
    };

    setUserStats(stats);
  }, [data]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200 min-w-64">
          <p className="font-bold text-gray-900 mb-3 text-center">{label}</p>
          
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
          
          {label && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                {label === 'Fri' && 'Peak activity day - highest user engagement'}
                {label === 'Mon' && 'Start of week - steady activity'}
                {label === 'Sun' && 'Weekend - slightly lower activity'}
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const RadialTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <p className="font-bold text-gray-900 mb-2">{payload[0].name}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Percentage:</span>
            <span className="font-bold text-gray-900">{payload[0].value}%</span>
          </div>
          <div className="mt-2 text-xs text-gray-600">
            {payload[0].name === 'Active Donors' && 'Regularly active donors'}
            {payload[0].name === 'New Users' && 'Joined in the last 30 days'}
            {payload[0].name === 'Volunteers' && 'Active volunteers'}
            {payload[0].name === 'Admins' && 'Platform administrators'}
            {payload[0].name === 'Inactive' && 'No activity in 30+ days'}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (selectedMetric) {
      case 'activity':
        return (
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="day" 
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
            <Bar 
              dataKey="activeUsers" 
              name="Active Users" 
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="newUsers" 
              name="New Users" 
              fill="#10b981"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="donations" 
              name="Donations" 
              fill="#8b5cf6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );

      case 'engagement':
        return (
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="day" 
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
            <Area
              type="monotone"
              dataKey="loginCount"
              name="Logins"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.2}
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="activeUsers"
              name="Active Users"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </AreaChart>
        );

      case 'performance':
        return (
          <RadialBarChart
            width={400}
            height={300}
            innerRadius="20%"
            outerRadius="90%"
            data={userDistribution}
            startAngle={180}
            endAngle={0}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <RadialBar
              minAngle={15}
              label={{ 
                position: 'insideStart', 
                fill: '#fff',
                fontSize: 12,
                fontWeight: 'bold'
              }}
              background
              clockWise={true}
              dataKey="value"
            >
              {userDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </RadialBar>
            <Tooltip content={<RadialTooltip />} />
            <Legend
              iconSize={10}
              layout="vertical"
              verticalAlign="middle"
              align="right"
            />
          </RadialBarChart>
        );

      default:
        return null;
    }
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <FiActivity className="w-5 h-5 mr-2 text-purple-600" />
            User Activity Analytics
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Monitor user engagement, activity patterns, and performance metrics
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
          {/* Metric Selector */}
          <div className="flex items-center space-x-2">
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
              disabled={isLoading}
            >
              {metricOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center space-x-2">
            <FiCalendar className="w-4 h-4 text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => onTimeRangeChange && onTimeRangeChange(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
              disabled={isLoading}
            >
              {timeRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* User Type Selector */}
          <div className="flex items-center space-x-2">
            <FiUsers className="w-4 h-4 text-gray-400" />
            <select
              value={userType}
              onChange={(e) => onUserTypeChange && onUserTypeChange(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
              disabled={isLoading}
            >
              {userTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Heatmap Toggle */}
          <button
            onClick={() => onHeatmapToggle && onHeatmapToggle(!showHeatmap)}
            className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors ${
              showHeatmap
                ? 'bg-purple-50 border-purple-500 text-purple-700'
                : 'border-gray-300 text-gray-700 hover:border-purple-300'
            }`}
            disabled={isLoading}
          >
            Heatmap
          </button>
        </div>
      </div>

      {/* User Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700">Total Users</p>
              <p className="text-2xl font-bold text-blue-900">{userStats.totalUsers}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
              <FiUsers className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-blue-600">
            {userStats.activeUsers} active • {userStats.userGrowth}% growth
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Active Users</p>
              <p className="text-2xl font-bold text-green-900">{userStats.activeUsers}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
              <FiActivity className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-green-600">
            {userStats.newUsersThisWeek} new this week
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700">Avg Donations/User</p>
              <p className="text-2xl font-bold text-purple-900">{userStats.avgDonationsPerUser}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100">
              <FiTrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-purple-600">
            {userStats.totalPoints?.toLocaleString()} total points
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-700">Peak Activity</p>
              <p className="text-2xl font-bold text-amber-900">{userStats.peakActivity?.split(',')[0]}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100">
              <FiClock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-amber-600">
            {userStats.peakActivity?.split(',')[1]?.trim()}
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Primary Chart */}
        <div className="lg:col-span-2 h-80">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-3"></div>
                <p className="text-gray-600">Loading activity data...</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          )}
        </div>

        {/* User Distribution Pie Chart */}
        <div className="h-80">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center">
            <FiUsers className="w-4 h-4 mr-2 text-gray-500" />
            User Distribution
          </h4>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                data={userDistribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
              >
                {userDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {userDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-4 flex items-center">
          <FiTrendingUp className="w-4 h-4 mr-2 text-gray-500" />
          Engagement Metrics
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {engagementMetrics.map((metric, index) => (
            <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <metric.icon className={`w-5 h-5 ${
                  metric.metric.includes('Session') ? 'text-blue-500' :
                  metric.metric.includes('Views') ? 'text-green-500' :
                  metric.metric.includes('Rate') ? 'text-purple-500' : 'text-amber-500'
                }`} />
                <span className={`text-sm font-medium ${
                  metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              <p className="text-sm text-gray-600 mt-1">{metric.metric}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performers */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-4 flex items-center">
          <FiAward className="w-4 h-4 mr-2 text-gray-500" />
          Top Performers
        </h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Donations</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Response Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Rating</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Points</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Level</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userPerformance.map((user, index) => {
                const level = user.points >= 1000 ? 'Gold' : user.points >= 500 ? 'Silver' : 'Bronze';
                const levelColor = level === 'Gold' ? 'text-amber-600' : level === 'Silver' ? 'text-gray-600' : 'text-amber-800';
                
                return (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{user.user}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-bold text-green-700">{user.donations}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-blue-700">{user.responseTime}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiStar className="w-4 h-4 text-amber-500 mr-1" />
                        <span className="font-medium">{user.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-bold text-purple-700">{user.points.toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelColor} bg-${levelColor.replace('text-', 'bg-')} bg-opacity-10`}>
                        {level}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Insights */}
      <div className="pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-4">Activity Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700 mb-1">
              <span className="font-medium">Peak Engagement:</span> Friday evenings
            </p>
            <p className="text-xs text-blue-600">
              Most users are active between 6-8 PM on Fridays
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-700 mb-1">
              <span className="font-medium">New User Growth:</span> 12.5% weekly
            </p>
            <p className="text-xs text-green-600">
              Consistent growth in new user registrations
            </p>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-700 mb-1">
              <span className="font-medium">Retention Rate:</span> 85% monthly
            </p>
            <p className="text-xs text-purple-600">
              High user retention with active engagement
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserActivityChart;