import React, { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaChartLine, FaFilter, FaDownload, FaCalendar, FaUsers, FaTint } from 'react-icons/fa';
import { motion } from 'framer-motion';
import DashboardHeader from '../../../components/ui/DashboardHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import FundingChart from '../../../components/charts/FundingChart';
import FundingTable from '../../../components/tables/FundingTable';
import useAdmin from '../../../hooks/useAdmin';
import { exportToPDF } from '../../../utils/pdfGenerator';

const FundingStatistics = () => {
  const { getFundingStatistics, loading } = useAdmin();
  
  const [stats, setStats] = useState(null);
  const [timeFilter, setTimeFilter] = useState('month');
  const [chartType, setChartType] = useState('bar');

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  useEffect(() => {
    fetchFundingStats();
  }, [timeFilter]);

  const fetchFundingStats = async () => {
    try {
      const data = await getFundingStatistics(timeFilter);
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch funding statistics:', error);
    }
  };

  const handleExportPDF = () => {
    if (!stats) return;
    
    const data = {
      title: 'Funding Statistics Report',
      period: timeFilter,
      stats: stats,
      exportDate: new Date().toLocaleDateString()
    };
    
    exportToPDF(data, 'funding-statistics');
  };

  const timeFilters = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'all', label: 'All Time' }
  ];

  if (loading && !stats) {
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
        title="Funding Statistics"
        subtitle="Monitor donations and financial contributions"
        showBackButton={true}
        backUrl="/dashboard"
      />

      {/* Summary Stats */}
      {stats && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FaMoneyBillWave className="text-2xl text-green-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">৳{stats.totalAmount?.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Funding</div>
              </div>
            </div>
            <div className="text-sm text-green-600 font-medium">
              ↑ {stats.growthPercentage}% from previous period
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FaUsers className="text-2xl text-blue-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stats.totalDonors}</div>
                <div className="text-sm text-gray-600">Total Donors</div>
              </div>
            </div>
            <div className="text-sm text-blue-600 font-medium">
              {stats.newDonors} new this period
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <FaTint className="text-2xl text-red-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stats.totalDonations}</div>
                <div className="text-sm text-gray-600">Total Donations</div>
              </div>
            </div>
            <div className="text-sm text-red-600 font-medium">
              {stats.averageAmount && `Avg: ৳${stats.averageAmount}`}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FaChartLine className="text-2xl text-purple-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">৳{stats.recentAmount?.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Recent 30 Days</div>
              </div>
            </div>
            <div className="text-sm text-purple-600 font-medium">
              {stats.recentDonations} donations
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
              Funding Analytics
            </h3>
            <p className="text-gray-600 text-sm">
              Analyze donation patterns and trends
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

          {/* Chart Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chart Type
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaChartLine className="text-gray-400" />
              </div>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
                <option value="area">Area Chart</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      {stats && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Main Funding Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Funding Overview - {timeFilters.find(f => f.value === timeFilter)?.label}
            </h3>
            <div className="h-80">
              <FundingChart 
                data={stats.chartData || []} 
                type={chartType}
              />
            </div>
          </div>

          {/* Top Donors */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top Donors
            </h3>
            <div className="space-y-4">
              {stats.topDonors?.map((donor, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                      {donor.name?.charAt(0) || 'D'}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{donor.name}</div>
                      <div className="text-sm text-gray-600">{donor.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">৳{donor.totalAmount?.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{donor.donationCount} donations</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent Transactions Table */}
      {stats && stats.recentTransactions && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Funding Transactions
            </h3>
          </div>
          <FundingTable transactions={stats.recentTransactions} />
        </motion.div>
      )}

      {/* Insights */}
      {stats && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaChartLine className="text-blue-600" />
              Key Insights
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span>Average donation amount: <strong>৳{stats.averageAmount}</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span>Growth rate: <strong className="text-green-600">{stats.growthPercentage}%</strong> compared to previous period</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span><strong>{stats.newDonors}</strong> new donors in this period</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaMoneyBillWave className="text-green-600" />
              Impact Analysis
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">•</span>
                <span>Total funds raised: <strong>৳{stats.totalAmount?.toLocaleString()}</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">•</span>
                <span>Funds used for emergency blood supplies: <strong>৳{stats.emergencyFunds?.toLocaleString()}</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">•</span>
                <span>Estimated lives impacted: <strong>{stats.livesImpacted || 0}</strong></span>
              </li>
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FundingStatistics;