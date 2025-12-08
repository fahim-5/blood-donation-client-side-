import React, { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaCreditCard, FaHistory, FaDownload, FaFilter, FaCalendar, FaChartLine, FaDonate } from 'react-icons/fa';
import { motion } from 'framer-motion';
import DashboardHeader from '../../../components/ui/DashboardHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import FundingTable from '../../../components/tables/FundingTable';
import PaymentModal from '../../../components/modals/PaymentModal';
import useAuth from '../../../hooks/useAuth';
import useFunding from '../../../hooks/useFunding';
import { exportToPDF } from '../../../utils/pdfGenerator';

const Funding = () => {
  const { user } = useAuth();
  const { getFundingHistory, getFundingStats, loading } = useFunding();
  
  const [fundingHistory, setFundingHistory] = useState([]);
  const [fundingStats, setFundingStats] = useState(null);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [timeFilter, setTimeFilter] = useState('all');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  useEffect(() => {
    fetchFundingData();
  }, []);

  useEffect(() => {
    filterHistory();
  }, [fundingHistory, timeFilter]);

  const fetchFundingData = async () => {
    try {
      const [history, stats] = await Promise.all([
        getFundingHistory(),
        getFundingStats()
      ]);
      setFundingHistory(history);
      setFilteredHistory(history);
      setFundingStats(stats);
    } catch (error) {
      console.error('Failed to fetch funding data:', error);
    }
  };

  const filterHistory = () => {
    let filtered = [...fundingHistory];

    // Apply time filter
    if (timeFilter !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();

      switch (timeFilter) {
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(item => new Date(item.date) >= cutoffDate);
    }

    setFilteredHistory(filtered);
    setCurrentPage(1);
  };

  const handlePaymentSuccess = () => {
    setPaymentModalOpen(false);
    fetchFundingData(); // Refresh data
  };

  const handleExportPDF = () => {
    if (filteredHistory.length === 0) {
      alert('No funding history to export');
      return;
    }
    
    const data = {
      title: 'Funding History Report',
      user: user?.name,
      period: timeFilter,
      history: filteredHistory,
      stats: fundingStats,
      exportDate: new Date().toLocaleDateString()
    };
    
    exportToPDF(data, 'funding-history');
  };

  const timeFilters = [
    { value: 'all', label: 'All Time' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'quarter', label: 'Last 90 Days' },
    { value: 'year', label: 'Last Year' }
  ];

  const quickDonationAmounts = [100, 500, 1000, 2000, 5000];

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader
        title="Funding & Donations"
        subtitle="Support our lifesaving mission through donations"
        showBackButton={true}
        backUrl="/dashboard"
      />

      {/* Stats Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
              <FaMoneyBillWave className="text-2xl text-green-600" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">৳{fundingStats?.totalDonated?.toLocaleString() || 0}</div>
              <div className="text-sm text-gray-600">Total Donated</div>
            </div>
          </div>
          <div className="text-sm text-green-700">
            {fundingStats?.donationCount || 0} donation{fundingStats?.donationCount !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
              <FaChartLine className="text-2xl text-blue-600" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">৳{fundingStats?.averageDonation?.toLocaleString() || 0}</div>
              <div className="text-sm text-gray-600">Average Donation</div>
            </div>
          </div>
          <div className="text-sm text-blue-700">
            {fundingStats?.lastDonation ? `Last: ${new Date(fundingStats.lastDonation).toLocaleDateString()}` : 'No donations yet'}
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
              <FaHistory className="text-2xl text-purple-600" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">{fundingStats?.monthlyDonations || 0}</div>
              <div className="text-sm text-gray-600">This Month</div>
            </div>
          </div>
          <div className="text-sm text-purple-700">
            {fundingStats?.monthlyAmount ? `৳${fundingStats.monthlyAmount.toLocaleString()}` : '৳0'}
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center">
              <FaDonate className="text-2xl text-red-600" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">{fundingStats?.impactCount || 0}</div>
              <div className="text-sm text-gray-600">Lives Impacted</div>
            </div>
          </div>
          <div className="text-sm text-red-700">
            ~{(fundingStats?.totalDonated / 5000 || 0).toFixed(0)} emergency kits
          </div>
        </div>
      </motion.div>

      {/* Donation Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl p-8"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="lg:w-2/3">
            <h2 className="text-2xl font-bold mb-4">Support Our Lifesaving Mission</h2>
            <p className="text-red-100 mb-6">
              Your donations help us maintain blood storage facilities, organize donation camps, 
              provide emergency transportation, and support families in need. Every contribution saves lives.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              {quickDonationAmounts.map(amount => (
                <button
                  key={amount}
                  onClick={() => setPaymentModalOpen(true)}
                  className="bg-white/20 hover:bg-white/30 text-white py-3 rounded-lg font-semibold transition-colors backdrop-blur-sm"
                >
                  ৳{amount}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:w-1/3 text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
              <div className="text-5xl mb-4">🩸</div>
              <h3 className="text-xl font-bold mb-2">Make a Difference</h3>
              <p className="text-red-100 mb-4">
                ৳5000 can provide one emergency blood kit
              </p>
              <button
                onClick={() => setPaymentModalOpen(true)}
                className="w-full bg-white text-red-600 hover:bg-gray-100 py-3 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2"
              >
                <FaCreditCard /> Donate Now
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters and Controls */}
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
              Donation History
            </h3>
            <p className="text-gray-600 text-sm">
              {filteredHistory.length} donation{filteredHistory.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExportPDF}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <FaDownload /> Export History
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Quick Stats */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Total in period</div>
                <div className="text-lg font-bold text-gray-900">
                  ৳{filteredHistory.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                </div>
              </div>
              <FaMoneyBillWave className="text-2xl text-gray-400" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Donation History Table */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        {loading && fundingHistory.length === 0 ? (
          <div className="p-12 text-center">
            <LoadingSpinner size="large" />
            <p className="text-gray-500 mt-4">Loading donation history...</p>
          </div>
        ) : filteredHistory.length > 0 ? (
          <>
            <FundingTable transactions={currentItems} />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, filteredHistory.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredHistory.length}</span> donations
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
              <FaHistory className="text-2xl text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Donation History
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {timeFilter !== 'all'
                ? 'No donations found in the selected time period.'
                : 'You haven\'t made any donations yet. Consider making your first donation to support our lifesaving mission.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {timeFilter !== 'all' && (
                <button
                  onClick={() => setTimeFilter('all')}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  View All Donations
                </button>
              )}
              <button
                onClick={() => setPaymentModalOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Make Your First Donation
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Impact Information */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How Your Donation Helps</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-800 text-sm font-bold">৳</span>
              </div>
              <span><strong>৳500</strong> provides blood testing for 10 donors</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-800 text-sm font-bold">৳</span>
              </div>
              <span><strong>৳1000</strong> funds emergency blood transportation</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-800 text-sm font-bold">৳</span>
              </div>
              <span><strong>৳5000</strong> provides one complete emergency blood kit</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Benefits</h3>
          <div className="space-y-3 text-gray-700">
            <p>
              All donations to our platform are tax-deductible under Section 44(6) of the Income Tax Ordinance.
            </p>
            <div className="bg-white/50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Tax Certificate</div>
              <div className="font-medium text-gray-900">Available upon request</div>
              <div className="text-xs text-gray-500 mt-1">
                Email: tax@blooddonation.org
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transparency</h3>
          <div className="space-y-3 text-gray-700">
            <p>
              We maintain complete transparency in fund utilization. Monthly reports are published on our website.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                <FaChartLine className="text-purple-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Financial Reports</div>
                <div className="text-sm text-gray-600">Updated monthly</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
        userId={user?._id}
        userName={user?.name}
        userEmail={user?.email}
      />
    </div>
  );
};

export default Funding;