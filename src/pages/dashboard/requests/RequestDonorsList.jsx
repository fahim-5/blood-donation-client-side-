import React, { useState, useEffect } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaTint, FaCheckCircle, FaTimesCircle, FaSearch, FaFilter, FaDownload } from 'react-icons/fa';
import { motion } from 'framer-motion';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import useDonations from '../../../hooks/useDonations';

const RequestDonorsList = ({ requestId, bloodGroup, district, upazila }) => {
  const { getPotentialDonors, assignDonorToRequest, loading } = useDonations();
  
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [assigningDonor, setAssigningDonor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  useEffect(() => {
    fetchPotentialDonors();
  }, [requestId, bloodGroup, district, upazila]);

  useEffect(() => {
    filterDonors();
  }, [donors, searchTerm, statusFilter]);

  const fetchPotentialDonors = async () => {
    try {
      const data = await getPotentialDonors({
        bloodGroup,
        district,
        upazila,
        requestId
      });
      setDonors(data);
      setFilteredDonors(data);
    } catch (error) {
      console.error('Failed to fetch potential donors:', error);
    }
  };

  const filterDonors = () => {
    let filtered = [...donors];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(donor => 
        donor.name.toLowerCase().includes(term) ||
        donor.email.toLowerCase().includes(term) ||
        donor.district?.toLowerCase().includes(term) ||
        donor.upazila?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(donor => donor.status === statusFilter);
    }

    setFilteredDonors(filtered);
    setCurrentPage(1);
  };

  const handleAssignDonor = async (donorId) => {
    setAssigningDonor(donorId);
    try {
      await assignDonorToRequest(requestId, donorId);
      // Refresh the donor list
      fetchPotentialDonors();
    } catch (error) {
      console.error('Failed to assign donor:', error);
    } finally {
      setAssigningDonor(null);
    }
  };

  const getDonorStatus = (donor) => {
    if (donor.status === 'active') {
      return {
        label: 'Available',
        color: 'bg-green-100 text-green-800',
        icon: <FaCheckCircle className="text-green-600" />
      };
    } else if (donor.status === 'recentlyDonated') {
      return {
        label: 'Recently Donated',
        color: 'bg-yellow-100 text-yellow-800',
        icon: <FaTimesCircle className="text-yellow-600" />
      };
    } else {
      return {
        label: 'Unavailable',
        color: 'bg-red-100 text-red-800',
        icon: <FaTimesCircle className="text-red-600" />
      };
    }
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDonors = filteredDonors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDonors.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Available' },
    { value: 'recentlyDonated', label: 'Recently Donated' },
    { value: 'unavailable', label: 'Unavailable' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Potential Blood Donors</h3>
        <p className="text-gray-700">
          Matching donors for <span className="font-bold text-red-600">{bloodGroup}</span> blood group in{' '}
          <span className="font-bold">{district}, {upazila}</span>
        </p>
      </div>

      {/* Filters */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="bg-white rounded-lg border border-gray-200 p-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Donors
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, location..."
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Donors List */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        {loading && donors.length === 0 ? (
          <div className="text-center py-12">
            <LoadingSpinner size="large" />
            <p className="text-gray-500 mt-4">Finding potential donors...</p>
          </div>
        ) : filteredDonors.length > 0 ? (
          <>
            <div className="text-sm text-gray-600 mb-2">
              {filteredDonors.length} potential donor{filteredDonors.length !== 1 ? 's' : ''} found
            </div>

            <div className="space-y-4">
              {currentDonors.map((donor) => {
                const status = getDonorStatus(donor);
                const isAvailable = donor.status === 'active';
                
                return (
                  <div
                    key={donor._id}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Donor Info */}
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                          {donor.name?.charAt(0) || 'D'}
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{donor.name}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <FaEnvelope className="text-gray-400" />
                                {donor.email}
                              </span>
                              {donor.phone && (
                                <span className="flex items-center gap-1">
                                  <FaPhone className="text-gray-400" />
                                  {donor.phone}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2">
                              <FaMapMarkerAlt className="text-gray-400" />
                              <span className="text-sm text-gray-700">
                                {donor.district}, {donor.upazila}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <FaTint className="text-red-400" />
                              <span className="text-sm font-medium text-red-600">
                                Blood Group: {donor.bloodGroup}
                              </span>
                            </div>
                            
                            <div className={`px-3 py-1 rounded-full flex items-center gap-2 ${status.color}`}>
                              {status.icon}
                              <span className="text-sm font-medium">{status.label}</span>
                            </div>
                          </div>

                          {donor.lastDonation && (
                            <div className="text-sm text-gray-500">
                              Last donation: {new Date(donor.lastDonation).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => window.open(`mailto:${donor.email}?subject=Blood Donation Request for ${bloodGroup}&body=Hello ${donor.name},%0D%0A%0D%0AI noticed you are a potential donor for our blood donation request. Please contact us for more details.`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          <FaEnvelope /> Email
                        </button>
                        
                        {isAvailable && (
                          <button
                            onClick={() => handleAssignDonor(donor._id)}
                            disabled={assigningDonor === donor._id}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                          >
                            {assigningDonor === donor._id ? (
                              <>
                                <LoadingSpinner size="small" />
                                Assigning...
                              </>
                            ) : (
                              <>
                                <FaCheckCircle />
                                Assign Donor
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, filteredDonors.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredDonors.length}</span> donors
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
              <FaUser className="text-2xl text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Potential Donors Found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || statusFilter !== 'all'
                ? 'No donors match your current filters. Try adjusting your search criteria.'
                : 'No available donors found matching the required blood group and location.'}
            </p>
            {(searchTerm || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </motion.div>

      {/* Tips Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips for Contacting Donors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-800 text-sm font-bold">1</span>
              </div>
              <span className="text-gray-700">Be polite and explain the urgency of the situation</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-800 text-sm font-bold">2</span>
              </div>
              <span className="text-gray-700">Provide clear hospital address and contact details</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-800 text-sm font-bold">3</span>
              </div>
              <span className="text-gray-700">Confirm donor availability before assigning</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-800 text-sm font-bold">4</span>
              </div>
              <span className="text-gray-700">Update request status promptly after donor assignment</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RequestDonorsList;