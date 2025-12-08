import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeartbeat, FaClock, FaMapMarkerAlt, FaTint, FaEye, FaCalendar, FaExclamationTriangle, FaFilter } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DonationRequestCard from '../../components/common/DonationRequestCard';
import useAuth from '../../hooks/useAuth';
import useDonations from '../../hooks/useDonations';
import { formatDate, formatTime, getTimeRemaining } from '../../utils/dateUtils';

const DonationRequests = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { getPublicDonationRequests, loading } = useDonations();
  
  const [donationRequests, setDonationRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [bloodGroupFilter, setBloodGroupFilter] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = ['Critical', 'Urgent', 'Normal'];

  useEffect(() => {
    fetchDonationRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [donationRequests, bloodGroupFilter, urgencyFilter, districtFilter]);

  const fetchDonationRequests = async () => {
    try {
      const requests = await getPublicDonationRequests();
      // Filter only pending requests as per requirements
      const pendingRequests = requests.filter(req => req.status === 'pending');
      setDonationRequests(pendingRequests);
      setFilteredRequests(pendingRequests);
    } catch (error) {
      console.error('Failed to fetch donation requests:', error);
    }
  };

  const filterRequests = () => {
    let filtered = [...donationRequests];

    if (bloodGroupFilter) {
      filtered = filtered.filter(req => req.bloodGroup === bloodGroupFilter);
    }

    if (urgencyFilter) {
      filtered = filtered.filter(req => {
        const timeRemaining = getTimeRemaining(req.donationDate, req.donationTime);
        if (urgencyFilter === 'Critical') return timeRemaining.hours <= 12;
        if (urgencyFilter === 'Urgent') return timeRemaining.hours <= 24;
        return true;
      });
    }

    if (districtFilter) {
      filtered = filtered.filter(req => 
        req.recipientDistrict?.toLowerCase().includes(districtFilter.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  };

  const handleViewDetails = (requestId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/donation-requests/${requestId}` } });
      return;
    }
    navigate(`/dashboard/requests/${requestId}`);
  };

  const handleClearFilters = () => {
    setBloodGroupFilter('');
    setUrgencyFilter('');
    setDistrictFilter('');
  };

  const getUrgencyLevel = (date, time) => {
    const timeRemaining = getTimeRemaining(date, time);
    if (timeRemaining.hours <= 12) return 'Critical';
    if (timeRemaining.hours <= 24) return 'Urgent';
    return 'Normal';
  };

  const stats = {
    total: donationRequests.length,
    critical: donationRequests.filter(req => 
      getUrgencyLevel(req.donationDate, req.donationTime) === 'Critical'
    ).length,
    today: donationRequests.filter(req => {
      const today = new Date().toISOString().split('T')[0];
      return req.donationDate === today;
    }).length
  };

  if (loading && donationRequests.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="py-16">
          <LoadingSpinner fullScreen />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Blood Donation Requests
              </h1>
              <p className="text-xl text-red-100 mb-8">
                View and respond to urgent blood donation requests
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 mt-8">
                {stats.total > 0 && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[150px]">
                    <div className="text-3xl font-bold">{stats.total}</div>
                    <div className="text-red-100">Total Requests</div>
                  </div>
                )}
                {stats.critical > 0 && (
                  <div className="bg-red-800/50 backdrop-blur-sm rounded-xl p-4 min-w-[150px]">
                    <div className="text-3xl font-bold">{stats.critical}</div>
                    <div className="text-red-100">Critical Needs</div>
                  </div>
                )}
                {stats.today > 0 && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[150px]">
                    <div className="text-3xl font-bold">{stats.today}</div>
                    <div className="text-red-100">Today's Requests</div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-6xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <FaFilter className="text-red-600" />
                    Filter Requests
                  </h2>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600">
                      {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''} found
                    </span>
                    <button
                      onClick={handleClearFilters}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Blood Group Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blood Group
                    </label>
                    <select
                      value={bloodGroupFilter}
                      onChange={(e) => setBloodGroupFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">All Blood Groups</option>
                      {bloodGroups.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>

                  {/* Urgency Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Urgency Level
                    </label>
                    <select
                      value={urgencyFilter}
                      onChange={(e) => setUrgencyFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">All Urgency Levels</option>
                      {urgencyLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  {/* District Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District
                    </label>
                    <input
                      type="text"
                      value={districtFilter}
                      onChange={(e) => setDistrictFilter(e.target.value)}
                      placeholder="Enter district name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Requests Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="py-16 text-center">
                <LoadingSpinner size="large" />
                <p className="text-gray-600 mt-4">Loading donation requests...</p>
              </div>
            ) : filteredRequests.length > 0 ? (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="max-w-6xl mx-auto"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredRequests.map((request) => {
                    const urgency = getUrgencyLevel(request.donationDate, request.donationTime);
                    const timeRemaining = getTimeRemaining(request.donationDate, request.donationTime);
                    
                    return (
                      <motion.div
                        key={request._id}
                        variants={fadeInUp}
                        whileHover={{ y: -5 }}
                        className="h-full"
                      >
                        <DonationRequestCard
                          request={request}
                          urgency={urgency}
                          timeRemaining={timeRemaining}
                          onViewDetails={() => handleViewDetails(request._id)}
                          isAuthenticated={isAuthenticated}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-4xl mx-auto text-center py-16"
              >
                <div className="bg-white rounded-2xl shadow-lg p-12">
                  <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaHeartbeat className="text-4xl text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    No Active Requests Found
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                    {donationRequests.length === 0
                      ? "There are currently no pending blood donation requests. Check back later or create a request if you need blood urgently."
                      : "No donation requests match your current filters. Try adjusting your filter criteria."
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={handleClearFilters}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                    >
                      Clear Filters
                    </button>
                    {isAuthenticated && (
                      <Link
                        to="/dashboard/create-donation-request"
                        className="bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                      >
                        Create New Request
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Information Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                How to Respond to a Request
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaEye className="text-2xl text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    1. View Details
                  </h3>
                  <p className="text-gray-600">
                    Click on any request to see complete details including hospital information and requirements.
                  </p>
                </div>
                
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaTint className="text-2xl text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    2. Check Eligibility
                  </h3>
                  <p className="text-gray-600">
                    Ensure your blood type matches and you meet all donor eligibility criteria.
                  </p>
                </div>
                
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaHeartbeat className="text-2xl text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    3. Donate Blood
                  </h3>
                  <p className="text-gray-600">
                    Contact the requester, visit the hospital, and save a life through your donation.
                  </p>
                </div>
              </div>
              
              {!isAuthenticated && (
                <div className="mt-12 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-8 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Ready to Save Lives?
                  </h3>
                  <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                    Sign in or register to respond to donation requests and join our community of lifesavers.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      to="/login"
                      className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
                    >
                      Sign In Now
                    </Link>
                    <Link
                      to="/register"
                      className="bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 px-8 py-3 rounded-lg font-semibold transition-all duration-300"
                    >
                      Register as Donor
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Urgent Requests Banner */}
        {stats.critical > 0 && (
          <section className="py-8 bg-gradient-to-r from-red-800 to-red-900 text-white">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-6xl mx-auto"
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <FaExclamationTriangle className="text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">
                        {stats.critical} Critical Blood Need{stats.critical !== 1 ? 's' : ''}
                      </h3>
                      <p className="text-red-100">
                        Immediate response required - Lives are at stake
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/login"
                    className="bg-white text-red-700 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
                  >
                    Respond Now
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default DonationRequests;