import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTint, FaUsers, FaMoneyBillWave, FaChartLine, FaClock, FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaUserCheck } from 'react-icons/fa';
import StatsCard from '../../components/ui/StatsCard';
import WelcomeBanner from '../../components/ui/WelcomeBanner';
import RecentRequestsTable from '../../components/tables/RecentRequestsTable';
import DonationStatsChart from '../../components/charts/DonationStatsChart';
import UserActivityChart from '../../components/charts/UserActivityChart';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useAuth from '../../hooks/useAuth';
import useDonations from '../../hooks/useDonations';
import useDashboard from '../../hooks/useDashboard';

const DashboardHome = () => {
  const { user } = useAuth();
  const { getRecentDonationRequests, loading: donationsLoading } = useDonations();
  const { getDashboardStats, loading: statsLoading } = useDashboard();
  
  const [recentRequests, setRecentRequests] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch recent donation requests
      if (user?.role === 'donor') {
        const requests = await getRecentDonationRequests(3);
        setRecentRequests(requests);
      }

      // Fetch dashboard statistics
      const stats = await getDashboardStats();
      setDashboardStats(stats);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const getRoleSpecificStats = () => {
    if (!dashboardStats) return [];

    const baseStats = [
      {
        title: 'Total Users',
        value: dashboardStats.totalUsers || 0,
        icon: <FaUsers className="text-2xl" />,
        color: 'bg-blue-500',
        trend: '+12%',
        description: 'Registered users'
      },
      {
        title: 'Total Funding',
        value: `৳${(dashboardStats.totalFunding || 0).toLocaleString()}`,
        icon: <FaMoneyBillWave className="text-2xl" />,
        color: 'bg-green-500',
        trend: '+25%',
        description: 'Total donations received'
      },
      {
        title: 'Blood Requests',
        value: dashboardStats.totalRequests || 0,
        icon: <FaTint className="text-2xl" />,
        color: 'bg-red-500',
        trend: '+8%',
        description: 'Total donation requests'
      }
    ];

    if (user?.role === 'admin') {
      baseStats.push({
        title: 'Today\'s Requests',
        value: dashboardStats.todaysRequests || 0,
        icon: <FaClock className="text-2xl" />,
        color: 'bg-purple-500',
        trend: dashboardStats.todaysRequests > 5 ? 'High' : 'Normal',
        description: 'Requests made today'
      });
    }

    if (user?.role === 'volunteer') {
      baseStats.push({
        title: 'Assigned Tasks',
        value: dashboardStats.assignedTasks || 0,
        icon: <FaUserCheck className="text-2xl" />,
        color: 'bg-yellow-500',
        trend: 'Active',
        description: 'Tasks assigned to you'
      });
    }

    return baseStats;
  };

  const getQuickActions = () => {
    const actions = [];

    if (user?.role === 'admin') {
      actions.push(
        { label: 'Manage Users', path: '/dashboard/all-users', icon: <FaUsers />, color: 'bg-blue-500' },
        { label: 'View All Requests', path: '/dashboard/all-donation-requests', icon: <FaTint />, color: 'bg-red-500' },
        { label: 'Analytics', path: '/dashboard/system-analytics', icon: <FaChartLine />, color: 'bg-purple-500' }
      );
    }

    if (user?.role === 'donor') {
      actions.push(
        { label: 'Create Request', path: '/dashboard/create-donation-request', icon: <FaTint />, color: 'bg-red-500' },
        { label: 'My Requests', path: '/dashboard/my-donation-requests', icon: <FaClock />, color: 'bg-blue-500' },
        { label: 'View All', path: '/dashboard/all-donation-requests-shared', icon: <FaUsers />, color: 'bg-green-500' }
      );
    }

    if (user?.role === 'volunteer') {
      actions.push(
        { label: 'View Requests', path: '/dashboard/all-donation-requests-volunteer', icon: <FaTint />, color: 'bg-red-500' },
        { label: 'My Tasks', path: '/dashboard/volunteer-tasks', icon: <FaUserCheck />, color: 'bg-blue-500' }
      );
    }

    // Common actions for all roles
    actions.push(
      { label: 'My Profile', path: '/dashboard/profile', icon: <FaUsers />, color: 'bg-gray-500' },
      { label: 'Funding', path: '/dashboard/funding', icon: <FaMoneyBillWave />, color: 'bg-green-500' }
    );

    return actions.slice(0, 4);
  };

  const getStatusCards = () => {
    if (!dashboardStats) return [];

    return [
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
        title: 'Cancelled',
        value: dashboardStats.cancelledRequests || 0,
        icon: <FaTimesCircle className="text-xl" />,
        color: 'bg-red-100 text-red-800',
        borderColor: 'border-red-200'
      }
    ];
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <WelcomeBanner
          userName={user?.name || 'User'}
          userRole={user?.role || 'donor'}
          userAvatar={user?.avatar}
          message={`Welcome back to your dashboard. ${user?.role === 'donor' ? 'Ready to save lives today?' : user?.role === 'admin' ? 'Monitor and manage the platform.' : 'Help coordinate donation efforts.'}`}
        />
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {getRoleSpecificStats().map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              trend={stat.trend}
              description={stat.description}
            />
          ))}
        </div>
      </motion.div>

      {/* Status Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {getStatusCards().map((card, index) => (
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
              onClick={() => setActiveTab('recent')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'recent' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Recent Activity
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'analytics' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Analytics
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {getQuickActions().map((action, index) => (
                    <a
                      key={index}
                      href={action.path}
                      className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow duration-200"
                    >
                      <div className={`${action.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`}>
                        <div className="text-white">
                          {action.icon}
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{action.label}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Recent Donation Requests (for donors) */}
              {user?.role === 'donor' && recentRequests.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Your Recent Donation Requests</h3>
                    <a
                      href="/dashboard/my-donation-requests"
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      View All →
                    </a>
                  </div>
                  <RecentRequestsTable requests={recentRequests} />
                </div>
              )}
            </div>
          )}

          {/* Recent Activity Tab */}
          {activeTab === 'recent' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Requests Table */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Recent Donation Requests</h4>
                  <div className="space-y-3">
                    {dashboardStats?.recentRequests?.slice(0, 5).map((request, index) => (
                      <div key={index} className="bg-white p-3 rounded border border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{request.recipientName}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : request.status === 'inprogress' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                            {request.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>{request.bloodGroup}</span>
                          <span>{request.district}</span>
                          <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Users */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Recent Users</h4>
                  <div className="space-y-3">
                    {dashboardStats?.recentUsers?.slice(0, 5).map((user, index) => (
                      <div key={index} className="bg-white p-3 rounded border border-gray-200 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                          {user.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full capitalize ${user.role === 'admin' ? 'bg-red-100 text-red-800' : user.role === 'donor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                          {user.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Donation Stats Chart */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Donation Statistics</h4>
                  <div className="h-64">
                    <DonationStatsChart data={dashboardStats?.donationStats || {}} />
                  </div>
                </div>

                {/* User Activity Chart */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-4">User Activity</h4>
                  <div className="h-64">
                    <UserActivityChart data={dashboardStats?.userActivity || {}} />
                  </div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Avg. Response Time</div>
                  <div className="text-2xl font-bold text-gray-900">2.4 hrs</div>
                  <div className="text-sm text-green-600 mt-1">↓ 15% from last month</div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Success Rate</div>
                  <div className="text-2xl font-bold text-gray-900">94%</div>
                  <div className="text-sm text-green-600 mt-1">↑ 5% from last month</div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Active Donors</div>
                  <div className="text-2xl font-bold text-gray-900">{dashboardStats?.activeDonors || 0}</div>
                  <div className="text-sm text-green-600 mt-1">↑ 8% from last month</div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Emergency Cases</div>
                  <div className="text-2xl font-bold text-gray-900">{dashboardStats?.emergencyCases || 0}</div>
                  <div className="text-sm text-red-600 mt-1">↑ 12% from last month</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Emergency Alert (if any critical requests) */}
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
                <p className="text-red-100">Immediate response required. Lives are at stake.</p>
              </div>
            </div>
            <a
              href={user?.role === 'admin' ? '/dashboard/all-donation-requests' : '/dashboard/all-donation-requests-shared'}
              className="bg-white text-red-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Respond Now
            </a>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardHome;