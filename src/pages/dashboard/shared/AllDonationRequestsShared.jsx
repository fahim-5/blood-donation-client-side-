import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTint, FaFilter, FaSearch, FaClock, FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaEye, FaHeartbeat } from 'react-icons/fa';
import { motion } from 'framer-motion';
import DashboardHeader from '../../../components/ui/DashboardHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import DonationRequestCard from '../../../components/common/DonationRequestCard';
import useAuth from '../../../hooks/useAuth';
import useDonations from '../../../hooks/useDonations';

const AllDonationRequestsShared = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getAllPublicDonationRequests, loading } = useDonations();
  
  const [donationRequests, setDonationRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewType, setViewType] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

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
  }, [donationRequests, statusFilter, bloodGroupFilter, districtFilter, searchTerm]);

  const fetchDonationRequests = async () => {
    try {
      const requests = await getAllPublicDonationRequests();
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

    // Apply district filter
    if (districtFilter) {
      filtered = filtered.filter(request => 
        request.recipientDistrict?.toLowerCase().includes(districtFilter.toLowerCase())
      );
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(request => 
        request.recipientName.toLowerCase().includes(term) ||
        request.hospitalName.toLowerCase().includes(term) ||
        request.recipientUpazila?.toLowerCase().includes(term)
      );
    }

    setFilteredRequests(filtered);
    setCurrentPage(1);
  };

  const handleViewDetails = (requestId) => {
    navigate(`/dashboard/requests/${requestId}`);
  };

  const handleCreateRequest = () => {
    navigate('/dashboard/create-donation-request');
  };

  const handleDonate = (requestId) => {
    navigate(`/dashboard/requests/${requestId}?tab=donors`);
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

  // Get unique districts for filter
  const uniqueDistricts = [...new Set(donationRequests.map(req => req.recipientDistrict).filter(Boolean))].sort();

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
    urgent: donationRequests.filter(r => {
      if (r.status !== 'pending') return false;
      const requestDate = new Date(r.donationDate);
      const today = new Date();
      const diffTime = requestDate - today;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays <= 1; // Urgent if within 24 hours
    }).length
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
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Requests</div>
        </div>
        <div className="bg-white border border-yellow-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Awaiting Donors</div>
        </div>
        <div className="bg-white border border-blue-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.inprogress}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-white border border-red-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
          <div className="text-sm text-gray-600">Urgent (24h)</div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl p-6"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Ready to Save a Life?</h3>
            <p className="text-red-100">
              Browse donation requests below. If you find a match for your blood type, 
              you can respond and potentially save a life today.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/search-donors')}
              className="bg-white text-red-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Search Donors
            </button>
            {user?.role === 'donor' && (
              <button
                onClick={handleCreateRequest}
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Create Request
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.2 }}
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

          <div className="flex items-center gap-3">
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewType('grid')}
                className={`px-4 py-2 ${viewType === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewType('list')}
                className={`px-4 py-2 ${viewType === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by recipient, hospital..."
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
                    {group === 'all' ? 'All Groups' : group}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* District Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              District
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Districts</option>
                {uniqueDistricts.map(district => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => {
              setStatusFilter('pending');
              setBloodGroupFilter(user?.bloodGroup || 'all');
            }}
            className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm hover:bg-red-200 transition-colors"
          >
            My Blood Type ({user?.bloodGroup || 'Any'})
          </button>
          <button
            onClick={() => {
              setStatusFilter('pending');
              setDistrictFilter(user?.district || '');
            }}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
          >
            My District ({user?.district || 'Any'})
          </button>
          <button
            onClick={() => {
              setStatusFilter('pending');
              setBloodGroupFilter('all');
              setDistrictFilter('');
              setSearchTerm('');
            }}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
          >
            Show All Pending
          </button>
          <button
            onClick={() => {
              setStatusFilter('all');
              setBloodGroupFilter('all');
              setDistrictFilter('');
              setSearchTerm('');
            }}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      </motion.div>

      {/* Requests Display */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.3 }}
      >
        {loading && donationRequests.length === 0 ? (
          <div className="p-12 text-center">
            <LoadingSpinner size="large" />
            <p className="text-gray-500 mt-4">Loading donation requests...</p>
          </div>
        ) : filteredRequests.length > 0 ? (
          <>
            {viewType === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentItems.map((request) => (
                  <DonationRequestCard
                    key={request._id}
                    request={request}
                    onViewDetails={() => handleViewDetails(request._id)}
                    onDonate={() => handleDonate(request._id)}
                    showDonateButton={user?.role === 'donor' && request.status === 'pending'}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {currentItems.map((request) => (
                  <div
                    key={request._id}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Request Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(request.status)}`}>
                            {getStatusIcon(request.status)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{request.recipientName}</h4>
                            <div className="text-sm text-gray-600">{request.hospitalName}</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <FaTint className="text-red-400" />
                            <span className="font-medium text-red-600">{request.bloodGroup}</span>
                          </div>
                          <div className="text-gray-600">
                            {request.recipientDistrict}, {request.recipientUpazila}
                          </div>
                          <div className="text-gray-600">
                            {new Date(request.donationDate).toLocaleDateString()} at {request.donationTime}
                          </div>
                        </div>

                        {request.requestMessage && (
                          <p className="text-gray-700 text-sm line-clamp-2">
                            {request.requestMessage}
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(request._id)}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          <FaEye /> Details
                        </button>
                        {user?.role === 'donor' && request.status === 'pending' && (
                          <button
                            onClick={() => handleDonate(request._id)}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            <FaHeartbeat /> Donate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
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
          <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTint className="text-2xl text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Donation Requests Found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || statusFilter !== 'all' || bloodGroupFilter !== 'all' || districtFilter
                ? 'No requests match your current filters. Try adjusting your search criteria.'
                : 'No donation requests available at the moment.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {(searchTerm || statusFilter !== 'all' || bloodGroupFilter !== 'all' || districtFilter) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setBloodGroupFilter('all');
                    setDistrictFilter('');
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Clear Filters
                </button>
              )}
              {user?.role === 'donor' && (
                <button
                  onClick={handleCreateRequest}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Create New Request
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Urgent Requests Banner */}
      {stats.urgent > 0 && (
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
                <h3 className="text-xl font-bold">{stats.urgent} Urgent Blood Need{stats.urgent !== 1 ? 's' : ''}</h3>
                <p className="text-red-100">These requests require immediate attention within 24 hours.</p>
              </div>
            </div>
            <button
              onClick={() => {
                setStatusFilter('pending');
                setSearchTerm('');
              }}
              className="bg-white text-red-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              View Urgent Requests
            </button>
          </div>
        </motion.div>
      )}

      {/* Information Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Respond</h3>
          <ol className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-800 text-sm font-bold">1</span>
              </div>
              <span>Find a request matching your blood type and location</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-800 text-sm font-bold">2</span>
              </div>
              <span>Click "View Details" to see complete information</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-800 text-sm font-bold">3</span>
              </div>
              <span>If you can help, click "Donate" to express your interest</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-800 text-sm font-bold">4</span>
              </div>
              <span>The requester will contact you to coordinate the donation</span>
            </li>
          </ol>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Eligibility Checklist</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <FaCheckCircle className="text-green-600 text-sm" />
              </div>
              <span>Age between 18-65 years</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <FaCheckCircle className="text-green-600 text-sm" />
              </div>
              <span>Weight at least 50 kg</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <FaCheckCircle className="text-green-600 text-sm" />
              </div>
              <span>Good health with no recent illnesses</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <FaCheckCircle className="text-green-600 text-sm" />
              </div>
              <span>Last donation at least 3 months ago</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default AllDonationRequestsShared;