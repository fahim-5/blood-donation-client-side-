import React, { useState, useEffect } from 'react';
import { FaChartBar, FaUsers, FaTint, FaClock, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaFilter, FaDownload, FaCalendar, FaServer, FaDatabase } from 'react-icons/fa';
import { motion } from 'framer-motion';
import DashboardHeader from '../../../components/ui/DashboardHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import DonationStatsChart from '../../../components/charts/DonationStatsChart';
import UserActivityChart from '../../../components/charts/UserActivityChart';
import MonthlyDonationsChart from '../../../components/charts/MonthlyDonationsChart';
import useAdmin from '../../../hooks/useAdmin';
import { exportToPDF } from '../../../utils/pdfGenerator';

const SystemAnalytics = () => {
  const { getSystemAnalytics, loading } = useAdmin();
  
  const [analytics, setAnalytics] = useState(null);
  const [timeFilter, setTimeFilter] = useState('month');
  const [activeTab, setActiveTab] = useState('performance');

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeFilter]);

  const fetchAnalytics = async () => {
    try {
      const data = await getSystemAnalytics(timeFilter);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const handleExportPDF = () => {
    if (!analytics) return;
    
    const data = {
      title: 'System Analytics Report',
      period: timeFilter,
      analytics: analytics,
      exportDate: new Date().toLocaleDateString()
    };
    
    exportToPDF(data, 'system-analytics');
  };

  const timeFilters = [
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'quarter', label: 'Last 90 Days' },
    { value: 'year', label: 'Last Year' },
    { value: 'all', label: 'All Time' }
  ];

  const performanceMetrics = analytics ? [
    {
      label: 'Response Time',
      value: `${analytics.avgResponseTime || 0} hours`,
      target: 'Under 3 hours',
      status: analytics.avgResponseTime <= 3 ? 'good' : 'warning',
      icon: <FaClock className="text-xl" />
    },
    {
      label: 'Success Rate',
      value: `${analytics.successRate || 0}%`,
      target: 'Above 90%',
      status: analytics.successRate >= 90 ? 'good' : 'warning',
      icon: <FaCheckCircle className="text-xl" />
    },
    {
      label: 'User Satisfaction',
      value: `${analytics.userSatisfaction || 0}/5`,
      target: 'Above 4.5',
      status: analytics.userSatisfaction >= 4.5 ? 'good' : 'warning',
      icon: <FaUsers className="text-xl" />
    },
    {
      label: 'System Uptime',
      value: `${analytics.systemUptime || 0}%`,
      target: '99.9%',
      status: analytics.systemUptime >= 99.9 ? 'good' : 'warning',
      icon: <FaServer className="text-xl" />
    }
  ] : [];

  if (loading && !analytics) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader
        title="System Analytics"
        subtitle="Comprehensive platform performance and usage metrics"
        showBackButton={true}
        backUrl="/dashboard"
      />

      {/* Summary Stats */}
      {analytics && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-2xl font-bold text-gray-900">{analytics.totalUsers || 0}</div>
            <div className="text-sm text-gray-600">Total Users</div>
            <div className="text-xs text-green-600 mt-1">
              +{analytics.userGrowth || 0}% growth
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-2xl font-bold text-gray-900">{analytics.totalRequests || 0}</div>
            <div className="text-sm text-gray-600">Total Requests</div>
            <div className="text-xs text-green-600 mt-1">
              +{analytics.requestGrowth || 0}% growth
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-2xl font-bold text-gray-900">{analytics.totalDonations || 0}</div>
            <div className="text-sm text-gray-600">Blood Donations</div>
            <div className="text-xs text-green-600 mt-1">
              {analytics.donationSuccessRate || 0}% success rate
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-2xl font-bold text-gray-900">{analytics.activeUsers || 0}</div>
            <div className="text-sm text-gray-600">Active Users</div>
            <div className="text-xs text-green-600 mt-1">
              {analytics.activeUserPercentage || 0}% of total
            </div>
          </div>
        </motion.div>
      )}

      {/* Filters and Controls */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Analytics Dashboard
            </h3>
            <p className="text-gray-600 text-sm">
              Monitor system performance and user engagement
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExportPDF}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <FaDownload /> Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Time Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Period
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCalendar className="text-gray-400" />
              </div>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {timeFilters.map(filter => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* View Tabs */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              View Type
            </label>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setActiveTab('performance')}
                className={`flex-1 py-2 px-4 text-sm font-medium ${activeTab === 'performance' ? 'bg-red-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
              >
                Performance
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`flex-1 py-2 px-4 text-sm font-medium ${activeTab === 'users' ? 'bg-red-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab('donations')}
                className={`flex-1 py-2 px-4 text-sm font-medium ${activeTab === 'donations' ? 'bg-red-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
              >
                Donations
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Performance Metrics */}
      {analytics && activeTab === 'performance' && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Performance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    metric.status === 'good' ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    <div className={metric.status === 'good' ? 'text-green-600' : 'text-yellow-600'}>
                      {metric.icon}
                    </div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    metric.status === 'good' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {metric.status === 'good' ? 'On Target' : 'Needs Attention'}
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-900">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.label}</div>
                <div className="text-xs text-gray-500 mt-1">Target: {metric.target}</div>
              </div>
            ))}
          </div>

          {/* System Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Response Time Chart */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time Trend</h3>
              <div className="h-64">
                {analytics.responseTimeChart && (
                  <UserActivityChart data={analytics.responseTimeChart} />
                )}
              </div>
            </div>

            {/* Success Rate Chart */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Success Rate Trend</h3>
              <div className="h-64">
                {analytics.successRateChart && (
                  <DonationStatsChart data={analytics.successRateChart} />
                )}
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <FaServer className="text-blue-600" />
                  <span className="font-medium text-gray-900">API Status</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <span className={`font-bold ${analytics.apiResponseTime < 500 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {analytics.apiResponseTime || 0}ms
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <FaDatabase className="text-green-600" />
                  <span className="font-medium text-gray-900">Database</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Connections</span>
                  <span className={`font-bold ${analytics.dbConnections < 50 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {analytics.dbConnections || 0}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <FaUsers className="text-purple-600" />
                  <span className="font-medium text-gray-900">Active Sessions</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current</span>
                  <span className="font-bold text-gray-900">{analytics.activeSessions || 0}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <FaExclamationTriangle className="text-red-600" />
                  <span className="font-medium text-gray-900">Errors</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last 24h</span>
                  <span className={`font-bold ${analytics.errorCount === 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analytics.errorCount || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* User Analytics */}
      {analytics && activeTab === 'users' && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth Chart */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
              <div className="h-64">
                {analytics.userGrowthChart && (
                  <MonthlyDonationsChart data={analytics.userGrowthChart} />
                )}
              </div>
            </div>

            {/* User Activity Chart */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity Patterns</h3>
              <div className="h-64">
                {analytics.userActivityChart && (
                  <UserActivityChart data={analytics.userActivityChart} />
                )}
              </div>
            </div>
          </div>

          {/* User Demographics */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Demographics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{analytics.userByRole?.donor || 0}</div>
                <div className="text-sm text-gray-600">Donors</div>
                <div className="text-xs text-gray-500">
                  {((analytics.userByRole?.donor / analytics.totalUsers) * 100).toFixed(1)}% of total
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{analytics.userByRole?.volunteer || 0}</div>
                <div className="text-sm text-gray-600">Volunteers</div>
                <div className="text-xs text-gray-500">
                  {((analytics.userByRole?.volunteer / analytics.totalUsers) * 100).toFixed(1)}% of total
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{analytics.userByRole?.admin || 0}</div>
                <div className="text-sm text-gray-600">Admins</div>
                <div className="text-xs text-gray-500">
                  {((analytics.userByRole?.admin / analytics.totalUsers) * 100).toFixed(1)}% of total
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{analytics.userByStatus?.active || 0}</div>
                <div className="text-sm text-gray-600">Active Users</div>
                <div className="text-xs text-gray-500">
                  {analytics.activeUserPercentage || 0}% active rate
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Donation Analytics */}
      {analytics && activeTab === 'donations' && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Donation Trend Chart */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Request Trend</h3>
              <div className="h-64">
                {analytics.donationTrendChart && (
                  <MonthlyDonationsChart data={analytics.donationTrendChart} />
                )}
              </div>
            </div>

            {/* Success Rate by Blood Group */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Success Rate by Blood Group</h3>
              <div className="space-y-4">
                {analytics.bloodGroupStats?.map((group, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-red-600">{group.bloodGroup}</span>
                      </div>
                      <span className="font-medium">{group.bloodGroup}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${group.successRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{group.successRate}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Donation Statistics */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {analytics.avgDonationTime || 0} days
                </div>
                <div className="text-sm text-gray-600">Average time between donations</div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {analytics.peakDonationHours || '9 AM - 5 PM'}
                </div>
                <div className="text-sm text-gray-600">Peak donation hours</div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {analytics.topDonationDistrict || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Most active district</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recommendations */}
      {analytics && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaChartBar className="text-blue-600" />
            Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Areas for Improvement</h4>
              <ul className="space-y-2 text-gray-700">
                {analytics.avgResponseTime > 3 && (
                  <li className="flex items-start gap-2">
                    <FaExclamationTriangle className="text-yellow-600 mt-0.5" />
                    <span>Average response time is high. Consider adding more volunteers.</span>
                  </li>
                )}
                {analytics.successRate < 90 && (
                  <li className="flex items-start gap-2">
                    <FaExclamationTriangle className="text-yellow-600 mt-0.5" />
                    <span>Success rate below target. Improve donor matching algorithm.</span>
                  </li>
                )}
                {analytics.userSatisfaction < 4.5 && (
                  <li className="flex items-start gap-2">
                    <FaExclamationTriangle className="text-yellow-600 mt-0.5" />
                    <span>User satisfaction needs improvement. Collect feedback and address issues.</span>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Success Factors</h4>
              <ul className="space-y-2 text-gray-700">
                {analytics.userGrowth > 10 && (
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-green-600 mt-0.5" />
                    <span>Strong user growth indicates effective outreach.</span>
                  </li>
                )}
                {analytics.activeUserPercentage > 40 && (
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-green-600 mt-0.5" />
                    <span>High active user rate shows good platform engagement.</span>
                  </li>
                )}
                {analytics.systemUptime >= 99.9 && (
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-green-600 mt-0.5" />
                    <span>Excellent system reliability and uptime.</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SystemAnalytics;