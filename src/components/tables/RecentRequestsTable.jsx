import { useState } from 'react';
import { FiEye, FiClock, FiAlertCircle, FiChevronRight, FiDroplet, FiMapPin, FiCalendar, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import StatusButton from '../ui/StatusButton';
import BloodGroupBadge from '../ui/BloodGroupBadge';

const RecentRequestsTable = ({
  requests = [],
  maxItems = 5,
  showViewAll = true,
  onViewAll,
  onViewDetails,
  loading = false,
  title = "Recent Donation Requests",
  subtitle = "Latest blood donation requests from donors",
  emptyMessage = "No recent donation requests",
  compact = false
}) => {
  const [expandedRequest, setExpandedRequest] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const getUrgencyBadge = (date) => {
    const requestDate = new Date(date);
    const today = new Date();
    const diffHours = Math.floor((requestDate - today) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
          <FiAlertCircle className="w-3 h-3 mr-1" />
          Urgent
        </span>
      );
    }
    
    if (diffHours < 48) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
          <FiClock className="w-3 h-3 mr-1" />
          Soon
        </span>
      );
    }
    
    return null;
  };

  const displayedRequests = requests.slice(0, maxItems);

  if (compact) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              {subtitle && (
                <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
              )}
            </div>
            {showViewAll && (
              <button
                onClick={onViewAll}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                View All
              </button>
            )}
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))
          ) : displayedRequests.length === 0 ? (
            <div className="p-8 text-center">
              <FiAlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{emptyMessage}</p>
            </div>
          ) : (
            displayedRequests.map((request) => (
              <div
                key={request._id}
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onViewDetails && onViewDetails(request._id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <BloodGroupBadge bloodGroup={request.bloodGroup} size="sm" />
                      <span className="font-medium text-gray-900">{request.recipientName}</span>
                      {getUrgencyBadge(request.donationDate)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                      <span className="flex items-center">
                        <FiMapPin className="w-3 h-3 mr-1" />
                        {request.recipientDistrict}
                      </span>
                      <span className="flex items-center">
                        <FiCalendar className="w-3 h-3 mr-1" />
                        {formatDate(request.donationDate)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <StatusButton status={request.status} size="sm" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
          
          {showViewAll && (
            <button
              onClick={onViewAll}
              className="inline-flex items-center text-sm text-red-600 hover:text-red-700 font-medium"
            >
              View All
              <FiChevronRight className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recipient & Blood Group
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Requester
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
            {loading ? (
              Array.from({ length: maxItems }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-28"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-8 bg-gray-200 rounded w-8"></div>
                  </td>
                </tr>
              ))
            ) : displayedRequests.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <FiAlertCircle className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-lg font-medium">{emptyMessage}</p>
                    <p className="text-sm mt-1">Check back later for new requests</p>
                  </div>
                </td>
              </tr>
            ) : (
              displayedRequests.map((request) => (
                <tr key={request._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <BloodGroupBadge bloodGroup={request.bloodGroup} size="md" />
                      <div>
                        <div className="font-medium text-gray-900">{request.recipientName}</div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          {getUrgencyBadge(request.donationDate)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <FiMapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <div>
                        <div>{request.recipientDistrict}</div>
                        <div className="text-gray-500">{request.recipientUpazila}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="flex items-center text-gray-900">
                        <FiCalendar className="w-4 h-4 mr-2 text-gray-400" />
                        {formatDate(request.donationDate)}
                      </div>
                      <div className="flex items-center text-gray-500 mt-1">
                        <FiClock className="w-4 h-4 mr-2" />
                        {formatTime(request.donationTime)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                        {request.requester?.avatar ? (
                          <img
                            src={request.requester.avatar}
                            alt={request.requester.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <FiUser className="text-red-600" />
                        )}
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {request.requester?.name || 'Unknown'}
                        </div>
                        <div className="text-gray-500">
                          {request.requester?.bloodGroup || ''}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusButton
                      status={request.status}
                      size="sm"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => onViewDetails && onViewDetails(request._id)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                        title="View Details"
                      >
                        <FiEye className="w-4 h-4" />
                        <span className="ml-1 hidden md:inline">View</span>
                      </button>
                      
                      {expandedRequest === request._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-10">
                          <Link
                            to={`/dashboard/donation-request/${request._id}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Full Details
                          </Link>
                          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Contact Requester
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      {displayedRequests.length > 0 && !loading && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">{displayedRequests.length}</span> of{' '}
              <span className="font-medium">{requests.length}</span> requests
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                  <span className="text-xs">Pending: {requests.filter(r => r.status === 'pending').length}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                  <span className="text-xs">In Progress: {requests.filter(r => r.status === 'inprogress').length}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                  <span className="text-xs">Completed: {requests.filter(r => r.status === 'done').length}</span>
                </div>
              </div>
              
              {requests.length > maxItems && (
                <button
                  onClick={onViewAll}
                  className="inline-flex items-center text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  See all {requests.length} requests
                  <FiChevronRight className="w-4 h-4 ml-1" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentRequestsTable;