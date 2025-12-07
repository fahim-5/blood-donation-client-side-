import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiMapPin, FiUser, FiDroplet, FiInfo, FiEdit2, FiTrash2, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import ConfirmationModal from './ConfirmationModal';
import StatusButton from '../ui/StatusButton';
import BloodGroupBadge from '../ui/BloodGroupBadge';
import UserStatusBadge from './UserStatusBadge';

const DonationRequestCard = ({ 
  request, 
  onStatusUpdate, 
  onDelete, 
  onEdit,
  showActions = true,
  showDonorInfo = false,
  compact = false 
}) => {
  const { user } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString; // Assuming time is already in HH:MM format
  };

  const handleStatusChange = async (newStatus) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      await onStatusUpdate(request._id, newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setShowDeleteModal(false);
    if (onDelete) {
      await onDelete(request._id);
    }
  };

  const canEdit = () => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user._id === request.requester?._id) return true;
    return false;
  };

  const canDelete = () => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user._id === request.requester?._id && request.status === 'pending') return true;
    return false;
  };

  const canUpdateStatus = () => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user.role === 'volunteer') return true;
    if (user._id === request.requester?._id && request.status === 'inprogress') return true;
    return false;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inprogress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'done': return 'bg-green-100 text-green-800 border-green-200';
      case 'canceled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'inprogress': return 'In Progress';
      case 'done': return 'Completed';
      case 'canceled': return 'Canceled';
      default: return status;
    }
  };

  if (compact) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <BloodGroupBadge bloodGroup={request.bloodGroup} />
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(request.status)}`}>
                {getStatusText(request.status)}
              </span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">{request.recipientName}</h3>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <FiMapPin className="w-4 h-4 mr-1" />
              <span>{request.recipientDistrict}, {request.recipientUpazila}</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <FiCalendar className="w-4 h-4 mr-1" />
                <span>{formatDate(request.donationDate)}</span>
              </div>
              <div className="flex items-center">
                <FiClock className="w-4 h-4 mr-1" />
                <span>{formatTime(request.donationTime)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link
              to={`/dashboard/donation-request/${request._id}`}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <FiInfo className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
        {/* Header */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <BloodGroupBadge bloodGroup={request.bloodGroup} size="lg" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {request.recipientName}
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(request.status)}`}>
                    {getStatusText(request.status)}
                  </span>
                  {showDonorInfo && request.donor && (
                    <div className="flex items-center text-sm text-gray-600">
                      <FiUser className="w-4 h-4 mr-1" />
                      <span>Donor: {request.donor.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Link
                to={`/dashboard/donation-request/${request._id}`}
                className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                <FiInfo className="w-4 h-4 mr-2" />
                View Details
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <FiMapPin className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-900">
                  {request.recipientDistrict}, {request.recipientUpazila}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FiCalendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Donation Date</p>
                <p className="font-medium text-gray-900">
                  {formatDate(request.donationDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <FiClock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Donation Time</p>
                <p className="font-medium text-gray-900">
                  {formatTime(request.donationTime)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <FiUser className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Requester</p>
                <p className="font-medium text-gray-900">
                  {request.requester?.name || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Hospital & Address */}
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Hospital</p>
            <p className="font-medium text-gray-900 mb-2">{request.hospitalName}</p>
            <p className="text-sm text-gray-600">{request.fullAddress}</p>
          </div>

          {/* Request Message */}
          {request.requestMessage && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Request Message</p>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                {request.requestMessage}
              </p>
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="pt-4 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center space-x-2">
                  {request.status === 'inprogress' && canUpdateStatus() && (
                    <>
                      <StatusButton
                        status="done"
                        onClick={() => handleStatusChange('done')}
                        loading={isUpdating}
                        icon={<FiCheckCircle className="w-4 h-4" />}
                      />
                      <StatusButton
                        status="canceled"
                        onClick={() => handleStatusChange('canceled')}
                        loading={isUpdating}
                        variant="danger"
                        icon={<FiXCircle className="w-4 h-4" />}
                      />
                    </>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {canEdit() && (
                    <button
                      onClick={() => onEdit && onEdit(request._id)}
                      className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      <FiEdit2 className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                  )}

                  {canDelete() && (
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="inline-flex items-center px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                    >
                      <FiTrash2 className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Donation Request"
        message="Are you sure you want to delete this donation request? This action cannot be undone."
        type="danger"
        confirmText="Delete"
        icon="delete"
      />
    </>
  );
};

export default DonationRequestCard;