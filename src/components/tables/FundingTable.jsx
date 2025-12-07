import { useState } from 'react';
import { FiDollarSign, FiUser, FiCalendar, FiDownload, FiChevronLeft, FiChevronRight, FiEye } from 'react-icons/fi';
import StatusButton from '../ui/StatusButton';

const FundingTable = ({
  donations = [],
  loading = false,
  pagination = null,
  onPageChange,
  onView,
  showUser = true,
  exportable = true,
  compact = false
}) => {
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const typeFilters = [
    { value: 'all', label: 'All Donations' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' }
  ];

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const filteredDonations = selectedType === 'all'
    ? donations
    : donations.filter(donation => donation.status === selectedType);

  const sortedDonations = [...filteredDonations].sort((a, b) => {
    const multiplier = sortOrder === 'asc' ? 1 : -1;
    
    switch (sortBy) {
      case 'amount':
        return (a.amount - b.amount) * multiplier;
      case 'date':
        return (new Date(b.date) - new Date(a.date)) * multiplier;
      case 'name':
        return (a.user?.name || '').localeCompare(b.user?.name || '') * multiplier;
      default:
        return 0;
    }
  });

  const formatCurrency = (amount) => {
    return `৳${Number(amount).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return { label: 'Completed', color: 'green' };
      case 'pending':
        return { label: 'Pending', color: 'yellow' };
      case 'failed':
        return { label: 'Failed', color: 'red' };
      default:
        return { label: status, color: 'gray' };
    }
  };

  if (compact) {
    return (
      <div className="space-y-3">
        {sortedDonations.map((donation) => (
          <div key={donation._id} className="bg-white rounded-lg border p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <FiDollarSign className="text-green-600" />
                  <span className="font-bold text-lg">{formatCurrency(donation.amount)}</span>
                </div>
                {showUser && (
                  <p className="text-sm text-gray-600">
                    {donation.isAnonymous ? 'Anonymous Donor' : donation.user?.name || 'Donor'}
                  </p>
                )}
                <p className="text-xs text-gray-500">{formatDate(donation.date)}</p>
              </div>
              <StatusButton
                status={donation.status === 'completed' ? 'done' : donation.status}
                size="sm"
              />
            </div>
            {donation.message && (
              <p className="mt-2 text-sm text-gray-700 italic border-t pt-2">
                "{donation.message}"
              </p>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {/* Type Filters */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              {typeFilters.map(filter => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>

            {/* Stats */}
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <FiDollarSign className="w-4 h-4" />
              <span>Total: {formatCurrency(donations.reduce((sum, d) => sum + d.amount, 0))}</span>
            </div>
          </div>

          {/* Export Button */}
          {exportable && (
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm">
              <FiDownload className="w-4 h-4 mr-2" />
              Export Report
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <FiUser className="w-4 h-4" />
                  <span>Donor</span>
                  {sortBy === 'name' && (
                    <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center space-x-1">
                  <FiDollarSign className="w-4 h-4" />
                  <span>Amount</span>
                  {sortBy === 'amount' && (
                    <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center space-x-1">
                  <FiCalendar className="w-4 h-4" />
                  <span>Date</span>
                  {sortBy === 'date' && (
                    <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Method
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
            {sortedDonations.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <FiDollarSign className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-lg font-medium">No donations found</p>
                    <p className="text-sm mt-1">Try changing your filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedDonations.map((donation) => {
                const statusConfig = getStatusConfig(donation.status);
                
                return (
                  <tr key={donation._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                          {donation.isAnonymous ? (
                            <span className="text-red-600 font-bold">A</span>
                          ) : donation.user?.avatar ? (
                            <img
                              src={donation.user.avatar}
                              alt={donation.user.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <FiUser className="text-red-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {donation.isAnonymous ? 'Anonymous' : donation.user?.name || 'Donor'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {donation.user?.email || donation.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatCurrency(donation.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(donation.date)}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(donation.date).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">
                        {donation.paymentMethod || 'Card'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {donation.transactionId ? `TX-${donation.transactionId.slice(-8)}` : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusButton
                        status={donation.status === 'completed' ? 'done' : donation.status}
                        size="sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => onView && onView(donation._id)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Details"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && onPageChange && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{pagination.start}</span> to{' '}
              <span className="font-medium">{pagination.end}</span> of{' '}
              <span className="font-medium">{pagination.total}</span> donations
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(pagination.current - 1)}
                disabled={!pagination.hasPrevious}
                className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
              
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`px-3 py-1 rounded-lg ${
                      pagination.current === pageNum
                        ? 'bg-red-600 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => onPageChange(pagination.current + 1)}
                disabled={!pagination.hasNext}
                className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(donations.filter(d => d.status === 'completed').reduce((sum, d) => sum + d.amount, 0))}
            </div>
            <div className="text-sm text-gray-600">Total Raised</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {donations.filter(d => d.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Successful Donations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(donations.filter(d => d.status === 'completed').reduce((sum, d) => sum + d.amount, 0) / 1000 * 5)}
            </div>
            <div className="text-sm text-gray-600">Estimated Lives Impacted</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundingTable;