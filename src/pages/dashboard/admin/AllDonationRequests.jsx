import React, { useState, useEffect } from 'react';
import { FaTint, FaFilter, FaSearch, FaClock, FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaEye, FaEdit, FaTrash, FaDownload } from 'react-icons/fa';
import { motion } from 'framer-motion';
import DashboardHeader from '../../../components/ui/DashboardHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import useAdmin from '../../../hooks/useAdmin';
import { exportToPDF } from '../../../utils/pdfGenerator';

const AllDonationRequests = () => {
  const { getAllDonationRequests, deleteDonationRequest, loading } = useAdmin();
  
  const [donationRequests, setDonationRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
        request.requesterName?.toLowerCase().includes(term) ||
        request.recipientDistrict.toLowerCase().includes(term) ||
        request.recipientUpazila.toLowerCase().includes(term)
      );
    }

    setFilteredRequests(filtered);
    setCurrentPage(1);
  };

  const handleDeleteRequest = async (requestId) => {
    setIsDeleting(true);
    try {
      await deleteDonationRequest(requestId);
      setDonationRequests(prev => prev.filter(req => req._id !== requestId));
      setDeleteModalOpen(false);
      setRequestToDelete(null);
    } catch (error) {
      console.error('Failed to delete request:', error);
    } finally {
      setIsDeleting(false);
    }
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
      exportDate: new Date().toLocaleDateString()
    };
    
    exportToPDF(data, 'all-donation-requests');
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
        subtitle="Manage and monitor all blood donation requests"
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
            <button
              onClick={handleExportPDF}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <FaDownload /> Export PDF
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
                placeholder="Search by recipient, hospital, requester..."
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

      {/* Requests Table */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        {loading && donationRequests.length === 0 ? (
          <div className="p-12 text-center">
            <LoadingSpinner size="large" />
            <p className="text-gray-500 mt-4">Loading donation requests...</p>
          </div>
        ) : filteredRequests.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requester
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipient & Hospital
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location & Date
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{request.requesterName}</div>
                        <div className="text-sm text-gray-500">{request.requesterEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{request.recipientName}</div>
                        <div className="text-sm text-gray-500">{request.hospitalName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {request.recipientDistrict}, {request.recipientUpazila}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(request.donationDate).toLocaleDateString()} at {request.donationTime}
                        </div>
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
                            onClick={() => window.open(`/dashboard/requests/${request._id}`, '_blank')}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => confirmDelete(request._id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete Request"
                            disabled={request.status === 'inprogress' || request.status === 'done'}
                          >
                            <FaTrash className={request.status === 'inprogress' || request.status === 'done' ? 'opacity-50 cursor-not-allowed' : ''} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
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
          <div className="p-12 text-center">
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
            {(searchTerm || statusFilter !== 'all' || bloodGroupFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setBloodGroupFilter('all');
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </motion.div>

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

export default AllDonationRequests;