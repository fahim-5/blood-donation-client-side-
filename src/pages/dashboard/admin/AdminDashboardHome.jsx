import React, { useState, useEffect } from 'react';
import { FaUsers, FaTint, FaMoneyBillWave, FaChartLine, FaExclamationTriangle, FaClock, FaCheckCircle, FaTimesCircle, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import DashboardHeader from '../../../components/ui/DashboardHeader';
import StatsCard from '../../../components/ui/StatsCard';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import DonationStatsChart from '../../../components/charts/DonationStatsChart';
import UserActivityChart from '../../../components/charts/UserActivityChart';
import MonthlyDonationsChart from '../../../components/charts/MonthlyDonationsChart';
import useAdmin from '../../../hooks/useAdmin';

const AdminDashboardHome = () => {
  const { getAdminDashboardStats, loading } = useAdmin();
  
  const [dashboardStats, setDashboardStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const stats = await getAdminDashboardStats();
      setDashboardStats(stats);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  const statsCards = dashboardStats ? [
    {
      title: 'Total Users',
      value: dashboardStats.totalUsers || 0,
      icon: <FaUsers className="text-2xl" />,
      color: 'bg-blue-500',
      trend: `+${dashboardStats.userGrowth || 0}%`,
      description: 'Registered users'
    },
    {
      title: 'Total Funding',
      value: `৳${(dashboardStats.totalFunding || 0).toLocaleString()}`,
      icon: <FaMoneyBillWave className="text-2xl" />,
      color: 'bg-green-500',
      trend: `+${dashboardStats.fundingGrowth || 0}%`,
      description: 'Total donations received'
    },
    {
      title: 'Blood Requests',
      value: dashboardStats.totalRequests || 0,
      icon: <FaTint className="text-2xl" />,
      color: 'bg-red-500',
      trend: `+${dashboardStats.requestGrowth || 0}%`,
      description: 'Total donation requests'
    },
    {
      title: 'Today\'s Activity',
      value: dashboardStats.todaysRequests || 0,
      icon: <FaClock className="text-2xl" />,
      color: 'bg-purple-500',
      trend: dashboardStats.todaysRequests > 5 ? 'High' : 'Normal',
      description: 'Requests today'
    }
  ] : [];

  const statusCards = dashboardStats ? [
    {
      title: 'Pending Requests',
      value: dashboardStats.pendingRequests || 0,
      icon: <FaClock className="text-xl" />,
      color: 'bg-yellow-100 text-yellow-800',
      borderColor: 'border-yellow-200'
    },
    {
      title: 'In Progress',
      value: dashboardStats.inProgressRequests || 0,
      icon: <FaExclamationTriangle className="text-xl" />,
      color: 'bg-blue-100 text-blue-800',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Completed',
      value: dashboardStats.completedRequests || 0,
      icon: <FaCheckCircle className="text-xl" />,
      color: 'bg-green-100 text-green-800',
      borderColor: 'border-green-200'
    },
    {
      title: 'Canceled',
      value: dashboardStats.canceledRequests || 0,
      icon: <FaTimesCircle className="text-xl" />,
      color: 'bg-red-100 text-red-800',
      borderColor: 'border-red-200'
    }
  ] : [];

  const quickActions = [
    {
      label: 'Manage Users',
      path: '/dashboard/all-users',
      icon: <FaUsers />,
      color: 'bg-blue-500',
      description: 'View and manage all users'
    },
    {
      label: 'All Requests',
      path: '/dashboard/all-donation-requests',
      icon: <FaTint />,
      color: 'bg-red-500',
      description: 'Monitor donation requests'
    },
    {
      label: 'Funding Stats',
      path: '/dashboard/funding-statistics',
      icon: <FaMoneyBillWave />,
      color: 'bg-green-500',
      description: 'View financial reports'
    },
    {
      label: 'System Analytics',
      path: '/dashboard/system-analytics',
      icon: <FaChartLine />,
      color: 'bg-purple-500',
      description: 'Platform analytics'
    }
  ];

  if (loading && !dashboardStats) {
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
        title="Admin Dashboard"
        subtitle="Monitor and manage the entire platform"
        showBackButton={false}
      />

      {/* Stats Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statsCards.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            trend={stat.trend}
            description={stat.description}
            loading={loading}
          />
        ))}
      </motion.div>

      {/* Status Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {statusCards.map((card, index) => (
          <div
            key={index}
            className={`bg-white border ${card.borderColor} rounded-xl p-4 shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>
              <div className={`${card.color} w-10 h-10 rounded-full flex items-center justify-center`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {quickActions.map((action, index) => (
          <a
            key={index}
            href={action.path}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className={`${action.color} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
              <div className="text-white text-xl">
                {action.icon}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {action.label}
            </h3>
            <p className="text-gray-600 text-sm">
              {action.description}
            </p>
          </a>
        ))}
      </motion.div>

      {/* Tabs for different views */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'overview' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'analytics' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'recent' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Recent Activity
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && dashboardStats && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Donation Statistics Chart */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Statistics</h3>
                  <div className="h-64">
                    <DonationStatsChart data={dashboardStats.donationStats || {}} />
                  </div>
                </div>

                {/* User Activity Chart */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity</h3>
                  <div className="h-64">
                    <UserActivityChart data={dashboardStats.userActivity || {}} />
                  </div>
                </div>
              </div>

              {/* Platform Health */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Success Rate</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {dashboardStats.successRate || 0}%
                  </div>
                  <div className="text-sm text-green-600 mt-1">
                    ↑ {dashboardStats.successRateGrowth || 0}% from last month
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Avg. Response Time</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {dashboardStats.avgResponseTime || 0} hours
                  </div>
                  <div className="text-sm text-green-600 mt-1">
                    ↓ {dashboardStats.responseTimeImprovement || 0}% from last month
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600">User Satisfaction</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {dashboardStats.userSatisfaction || 0}/5
                  </div>
                  <div className="text-sm text-green-600 mt-1">
                    Based on {dashboardStats.feedbackCount || 0} reviews
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && dashboardStats && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Donations Chart */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Donations Trend</h3>
                  <div className="h-64">
                    <MonthlyDonationsChart data={dashboardStats.monthlyDonations || {}} />
                  </div>
                </div>

                {/* User Growth Chart */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
                  <div className="h-64">
                    <UserActivityChart data={dashboardStats.userGrowthData || {}} />
                  </div>
                </div>
              </div>

              {/* Detailed Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Top Blood Groups Needed</h4>
                  <div className="space-y-3">
                    {dashboardStats.topBloodGroups?.map((group, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{group.name}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full"
                              style={{ width: `${(group.count / dashboardStats.totalRequests) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{group.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Top Districts by Activity</h4>
                  <div className="space-y-3">
                    {dashboardStats.topDistricts?.map((district, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{district.name}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(district.count / dashboardStats.totalRequests) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{district.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity Tab */}
          {activeTab === 'recent' && dashboardStats && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Requests */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Recent Donation Requests</h4>
                    <a href="/dashboard/all-donation-requests" className="text-sm text-red-600 hover:text-red-700">
                      View All <FaArrowRight className="inline ml-1" />
                    </a>
                  </div>
                  <div className="space-y-3">
                    {dashboardStats.recentRequests?.slice(0, 5).map((request, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium text-gray-900">{request.recipientName}</div>
                          <div className="text-sm text-gray-600">{request.hospitalName}</div>
                        </div>
                        <div className="text-right">
                          <div className={`px-2 py-1 text-xs rounded-full ${
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            request.status === 'inprogress' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {request.status}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{request.bloodGroup}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Users */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Recent User Registrations</h4>
                    <a href="/dashboard/all-users" className="text-sm text-red-600 hover:text-red-700">
                      View All <FaArrowRight className="inline ml-1" />
                    </a>
                  </div>
                  <div className="space-y-3">
                    {dashboardStats.recentUsers?.slice(0, 5).map((user, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                            {user.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-xs text-gray-600">{user.email}</div>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' :
                          user.role === 'volunteer' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Funding */}
              {dashboardStats.recentFunding && dashboardStats.recentFunding.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Recent Funding Transactions</h4>
                    <a href="/dashboard/funding-statistics" className="text-sm text-red-600 hover:text-red-700">
                      View All <FaArrowRight className="inline ml-1" />
                    </a>
                  </div>
                  <div className="space-y-3">
                    {dashboardStats.recentFunding.slice(0, 5).map((funding, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium text-gray-900">{funding.userName}</div>
                          <div className="text-sm text-gray-600">{funding.email}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">৳{funding.amount}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(funding.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Emergency Alert */}
      {dashboardStats?.criticalRequests > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{dashboardStats.criticalRequests} Critical Blood Needs</h3>
                <p className="text-red-100">Immediate attention required. Lives are at stake.</p>
              </div>
            </div>
            <a
              href="/dashboard/all-donation-requests"
              className="bg-white text-red-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Take Action
            </a>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboardHome;