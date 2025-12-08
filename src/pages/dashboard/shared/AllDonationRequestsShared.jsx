import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTint, FaFilter, FaSearch, FaClock, FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaEye, FaHeartbeat, FaDownload } from 'react-icons/fa';
import { motion } from 'framer-motion';
import DashboardHeader from '../../../components/ui/DashboardHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import DonationRequestCard from '../../../components/common/DonationRequestCard';
import useAuth from '../../../hooks/useAuth';
import useDonations from '../../../hooks/useDonations';
import { exportToPDF } from '../../../utils/pdfGenerator';

const AllDonationRequestsShared = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getAllDonationRequests, loading } = useDonations();
  
  const [donationRequests, setDonationRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'inprogress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
    { value: 'canceled', label: 'Canceled' }
  ];

  const bloodGroups = ['all', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    fetchDonationRequests();
  }, []);

  useEffect(() => {
    filterAndSearchRequests();
  }, [donationRequests, statusFilter, bloodGroupFilter, searchTerm]);

  const fetchDonationRequests = async () => {
    try {
      const requests = await getAllDonationRequests();
      setDonationRequests(requests);
      setFilteredRequests(requests);
    } catch (error) {
      console.error('Failed to fetch donation requests:', error);
    }
  };

  const filterAndSearchRequests = () => {
    let filtered = [...donationRequests];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    // Apply blood group filter
    if (bloodGroupFilter !== 'all') {
      filtered = filtered.filter(request => request.bloodGroup === bloodGroupFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(request => 
        request.recipientName.toLowerCase().includes(term) ||
        request.hospitalName.toLowerCase().includes(term) ||
        request.recipientDistrict.toLowerCase().includes(term) ||
        request.recipientUpazila.toLowerCase().includes(term) ||
        request.requesterName?.toLowerCase().includes(term)
      );
    }

    setFilteredRequests(filtered);
    setCurrentPage(1);
  };

  const handleViewDetails = (requestId) => {
    navigate(`/dashboard/requests/${requestId}`);
  };

  const handleDonate = (requestId) => {
    navigate(`/dashboard/requests/${requestId}`, { state: { donate: true } });
  };

  const handleExportPDF = () => {
    if (filteredRequests.length === 0) {
      alert('No requests to export');
      return;
    }
    
    const data = {
      title: 'All Donation Requests Report',
      filters: { 
        status: statusFilter, 
        bloodGroup: bloodGroupFilter,
        search: searchTerm 
      },
      requests: filteredRequests,
      user: user?.name,
      exportDate: new Date().toLocaleDateString()
    };
    
    exportToPDF(data, 'all-donation-requests-shared');
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

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stats = {
    total: donationRequests.length,
    pending: donationRequests.filter(r => r.status === 'pending').length,
    inprogress: donationRequests.filter(r => r.status === 'inprogress').length,
    done: donationRequests.filter(r => r.status === 'done').length,
    canceled: donationRequests.filter(r => r.status === 'canceled').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader
        title="All Donation Requests"
        subtitle="Browse and respond to blood donation requests"
        showBackButton={true}
        backUrl="/dashboard"
      />

      {/* Stats Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
      >
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-white border border-yellow-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white border border-blue-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.inprogress}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-white border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{stats.done}</div>
          <div className="text-sm text-gray-600">Done</div>
        </div>
        <div className="bg-white border border-red-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600">{stats.canceled}</div>
          <div className="text-sm text-gray-600">Canceled</div>
        </div>
      </motion.div>

      {/* Filters */}
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
              Filter Requests
            </h3>
            <p className="text-gray-600 text-sm">
              {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 ${viewMode === 'grid' ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 ${viewMode === 'list' ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
              >
                List
              </button>
            </div>
            
            <button
              onClick={handleExportPDF}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <FaDownload /> Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Requests
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by recipient, hospital, location..."
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Blood Group Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Group
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaTint className="text-gray-400" />
              </div>
              <select
                value={bloodGroupFilter}
                onChange={(e) => setBloodGroupFilter(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {bloodGroups.map(group => (
                  <option key={group} value={group}>
                    {group === 'all' ? 'All Blood Groups' : group}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Requests Display */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.2 }}
      >
        {loading && donationRequests.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-gray-200">
            <LoadingSpinner size="large" />
            <p className="text-gray-500 mt-4">Loading donation requests...</p>
          </div>
        ) : filteredRequests.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentItems.map((request) => (
                  <DonationRequestCard
                    key={request._id}
                    request={request}
                    onViewDetails={() => handleViewDetails(request._id)}
                    onDonate={() => handleDonate(request._id)}
                    showDonateButton={user?.bloodGroup === request.bloodGroup && request.status === 'pending'}
                    currentUser={user}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Recipient
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location & Hospital
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
                      {currentItems.map((request) => (
                        <tr key={request._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{request.recipientName}</div>
                            <div className="text-sm text-gray-500">By: {request.requesterName}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {request.recipientDistrict}, {request.recipientUpazila}
                            </div>
                            <div className="text-sm text-gray-500">{request.hospitalName}</div>
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
                              {user?.bloodGroup === request.bloodGroup && request.status === 'pending' && (
                                <button
                                  onClick={() => handleDonate(request._id)}
                                  className="text-red-600 hover:text-red-900 p-1"
                                  title="Donate Blood"
                                >
                                  <FaHeartbeat />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 bg-white px-6 py-4 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, filteredRequests.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredRequests.length}</span> requests
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-3 py-1 border text-sm font-medium rounded ${
                            currentPage === pageNumber
                              ? 'bg-red-600 text-white border-red-600'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-12 text-center bg-white rounded-xl border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTint className="text-2xl text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Donation Requests Found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || statusFilter !== 'all' || bloodGroupFilter !== 'all'
                ? 'No requests match your current filters. Try adjusting your search criteria.'
                : 'No donation requests found in the system.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {(searchTerm || statusFilter !== 'all' || bloodGroupFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setBloodGroupFilter('all');
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Clear Filters
                </button>
              )}
              {user?.role === 'donor' && (
                <button
                  onClick={() => navigate('/dashboard/create-donation-request')}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Create Your First Request
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Urgent Requests Banner */}
      {stats.pending > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl p-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{stats.pending} Pending Blood Requests</h3>
                <p className="text-red-100">
                  Your donation could save a life today. Check if you can help!
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setStatusFilter('pending');
                setBloodGroupFilter(user?.bloodGroup || 'all');
              }}
              className="bg-white text-red-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-bold transition-colors whitespace-nowrap"
            >
              View Matching Requests
            </button>
          </div>
        </motion.div>
      )}

      {/* Compatibility Info */}
      {user?.bloodGroup && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Blood Group Compatibility</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-2">Your Blood Group</div>
              <div className="text-2xl font-bold text-red-600">{user.bloodGroup}</div>
              <p className="text-gray-700 text-sm mt-2">
                You can donate to requests with matching blood groups.
              </p>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">Matching Requests Available</div>
              <div className="text-2xl font-bold text-gray-900">
                {donationRequests.filter(r => r.bloodGroup === user.bloodGroup && r.status === 'pending').length}
              </div>
              <button
                onClick={() => {
                  setStatusFilter('pending');
                  setBloodGroupFilter(user.bloodGroup);
                }}
                className="mt-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                View all matching requests →
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AllDonationRequestsShared;