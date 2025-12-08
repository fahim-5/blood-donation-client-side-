import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaTint, FaClock, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaEye, FaEdit, FaTrash, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import WelcomeBanner from '../../../components/ui/WelcomeBanner';
import RecentRequestsTable from '../../../components/tables/RecentRequestsTable';
import StatsCard from '../../../components/ui/StatsCard';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import useAuth from '../../../hooks/useAuth';
import useDonations from '../../../hooks/useDonations';

const DonorDashboardHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    getRecentDonationRequests, 
    getDonorStats, 
    deleteDonationRequest,
    updateDonationStatus,
    loading 
  } = useDonations();
  
  const [recentRequests, setRecentRequests] = useState([]);
  const [donorStats, setDonorStats] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [requests, stats] = await Promise.all([
        getRecentDonationRequests(3),
        getDonorStats()
      ]);
      setRecentRequests(requests);
      setDonorStats(stats);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    setIsDeleting(true);
    try {
      await deleteDonationRequest(requestId);
      setRecentRequests(prev => prev.filter(req => req._id !== requestId));
      setDeleteModalOpen(false);
      setRequestToDelete(null);
      
      // Refresh stats after deletion
      const stats = await getDonorStats();
      setDonorStats(stats);
    } catch (error) {
      console.error('Failed to delete request:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    setStatusUpdateLoading(true);
    try {
      await updateDonationStatus(requestId, newStatus);
      
      // Update local state
      setRecentRequests(prev => 
        prev.map(req => 
          req._id === requestId ? { ...req, status: newStatus } : req
        )
      );
      
      // Refresh stats
      const stats = await getDonorStats();
      setDonorStats(stats);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const handleViewDetails = (requestId) => {
    navigate(`/dashboard/requests/${requestId}`);
  };

  const handleEditRequest = (requestId) => {
    navigate(`/dashboard/edit-donation-request/${requestId}`);
  };

  const confirmDelete = (requestId) => {
    setRequestToDelete(requestId);
    setDeleteModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inprogress': return 'bg-blue-100 text-blue-800';
      case 'done': return 'bg-green-100 text-green-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaClock className="text-yellow-600" />;
      case 'inprogress': return <FaExclamationTriangle className="text-blue-600" />;
      case 'done': return <FaCheckCircle className="text-green-600" />;
      case 'canceled': return <FaTimesCircle className="text-red-600" />;
      default: return <FaClock className="text-gray-600" />;
    }
  };

  const stats = [
    {
      title: 'Total Requests',
      value: donorStats?.totalRequests || 0,
      icon: <FaTint className="text-2xl" />,
      color: 'bg-red-500',
      description: 'Requests you created'
    },
    {
      title: 'Pending',
      value: donorStats?.pendingRequests || 0,
      icon: <FaClock className="text-2xl" />,
      color: 'bg-yellow-500',
      description: 'Awaiting donors'
    },
    {
      title: 'Completed',
      value: donorStats?.completedRequests || 0,
      icon: <FaCheckCircle className="text-2xl" />,
      color: 'bg-green-500',
      description: 'Successfully donated'
    },
    {
      title: 'Active Donations',
      value: donorStats?.activeDonations || 0,
      icon: <FaExclamationTriangle className="text-2xl" />,
      color: 'bg-blue-500',
      description: 'Currently in progress'
    }
  ];

  const quickActions = [
    {
      label: 'Create New Request',
      path: '/dashboard/create-donation-request',
      icon: <FaPlus />,
      color: 'bg-red-500 hover:bg-red-600',
      description: 'Request blood for someone'
    },
    {
      label: 'View All Requests',
      path: '/dashboard/my-donation-requests',
      icon: <FaTint />,
      color: 'bg-blue-500 hover:bg-blue-600',
      description: 'See all your requests'
    },
    {
      label: 'Search Donors',
      path: '/search-donors',
      icon: <FaEye />,
      color: 'bg-green-500 hover:bg-green-600',
      description: 'Find available donors'
    }
  ];

  if (loading && !donorStats) {
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
          userName={user?.name || 'Donor'}
          userRole="donor"
          userAvatar={user?.avatar}
          message={`Welcome back! You have ${donorStats?.pendingRequests || 0} pending requests and have helped save ${donorStats?.livesSaved || 0} lives.`}
          showStats={true}
        />
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            description={stat.description}
            loading={loading}
          />
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {quickActions.map((action, index) => (
          <Link
            key={index}
            to={action.path}
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
          </Link>
        ))}
      </motion.div>

      {/* Recent Donation Requests */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Donation Requests
            </h2>
            {recentRequests.length > 0 && (
              <Link
                to="/dashboard/my-donation-requests"
                className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
              >
                View All <FaArrowRight />
              </Link>
            )}
          </div>
        </div>

        {loading && recentRequests.length === 0 ? (
          <div className="p-12 text-center">
            <LoadingSpinner size="medium" />
            <p className="text-gray-500 mt-4">Loading your requests...</p>
          </div>
        ) : recentRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blood Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentRequests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{request.recipientName}</div>
                      <div className="text-sm text-gray-500">{request.hospitalName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.recipientDistrict}</div>
                      <div className="text-sm text-gray-500">{request.recipientUpazila}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(request.donationDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">{request.donationTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        {request.bloodGroup}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                        </div>
                        <span className="capitalize">{request.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(request._id)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEditRequest(request._id)}
                          className="text-yellow-600 hover:text-yellow-900 p-1"
                          title="Edit Request"
                          disabled={request.status !== 'pending'}
                        >
                          <FaEdit className={request.status !== 'pending' ? 'opacity-50 cursor-not-allowed' : ''} />
                        </button>
                        <button
                          onClick={() => confirmDelete(request._id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete Request"
                          disabled={request.status === 'inprogress' || request.status === 'done'}
                        >
                          <FaTrash className={request.status === 'inprogress' || request.status === 'done' ? 'opacity-50 cursor-not-allowed' : ''} />
                        </button>
                        
                        {/* Status update buttons for inprogress requests */}
                        {request.status === 'inprogress' && (
                          <div className="flex gap-1 ml-2">
                            <button
                              onClick={() => handleStatusUpdate(request._id, 'done')}
                              disabled={statusUpdateLoading}
                              className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 disabled:opacity-50"
                            >
                              Done
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(request._id, 'canceled')}
                              disabled={statusUpdateLoading}
                              className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200 disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTint className="text-2xl text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Donation Requests Yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You haven't created any donation requests yet. Create your first request to get started.
            </p>
            <Link
              to="/dashboard/create-donation-request"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <FaPlus /> Create Your First Request
            </Link>
          </div>
        )}
      </motion.div>

      {/* Additional Info Section */}
      {donorStats && donorStats.totalRequests > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Impact Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Impact</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Lives Potentially Saved</span>
                <span className="text-2xl font-bold text-blue-600">{donorStats.livesSaved || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Total Blood Requests</span>
                <span className="text-2xl font-bold text-blue-600">{donorStats.totalRequests}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Success Rate</span>
                <span className="text-2xl font-bold text-green-600">
                  {donorStats.totalRequests > 0 
                    ? `${Math.round((donorStats.completedRequests / donorStats.totalRequests) * 100)}%` 
                    : '0%'}
                </span>
              </div>
            </div>
          </div>

          {/* Tips for Success */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips for Faster Response</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-800 text-sm">1</span>
                </div>
                <span className="text-gray-700">Provide complete hospital address and contact details</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-800 text-sm">2</span>
                </div>
                <span className="text-gray-700">Update request status promptly when donors respond</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-800 text-sm">3</span>
                </div>
                <span className="text-gray-700">Respond quickly to donor inquiries</span>
              </li>
            </ul>
          </div>
        </motion.div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setRequestToDelete(null);
        }}
        onConfirm={() => handleDeleteRequest(requestToDelete)}
        title="Delete Donation Request"
        message="Are you sure you want to delete this donation request? This action cannot be undone."
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        confirmColor="bg-red-600 hover:bg-red-700"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DonorDashboardHome;