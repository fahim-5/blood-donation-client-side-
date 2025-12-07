import { useState } from 'react';
import { FiUser, FiMapPin, FiDroplet, FiPhone, FiMail, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import BloodGroupBadge from '../ui/BloodGroupBadge';
import UserStatusBadge from './UserStatusBadge';
import RoleBadge from './RoleBadge';

const DonorCard = ({ 
  donor, 
  showContact = false,
  onContactClick,
  showActions = false,
  onActionClick,
  actionLabel = "Contact",
  compact = false 
}) => {
  const { user } = useAuth();
  const [showFullInfo, setShowFullInfo] = useState(false);

  const lastDonationDate = donor.lastDonationDate 
    ? new Date(donor.lastDonationDate).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : 'Never';

  const isAvailable = () => {
    if (!donor.availability) return true;
    if (donor.availability === 'available') return true;
    if (donor.availability === 'unavailable') return false;
    return true;
  };

  const getAvailabilityBadge = () => {
    if (!donor.availability || donor.availability === 'available') {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
          Available
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 border border-red-200">
        Unavailable
      </span>
    );
  };

  const handleContactClick = () => {
    if (onContactClick) {
      onContactClick(donor);
    }
  };

  const handleActionClick = () => {
    if (onActionClick) {
      onActionClick(donor);
    }
  };

  if (compact) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center overflow-hidden ring-2 ring-white">
              {donor.avatar ? (
                <img
                  src={donor.avatar}
                  alt={donor.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiUser className="text-red-600 w-6 h-6" />
              )}
            </div>
            {!isAvailable() && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-gray-800 truncate">
                {donor.name}
              </h3>
              <BloodGroupBadge bloodGroup={donor.bloodGroup} />
            </div>
            
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <FiMapPin className="w-3 h-3 mr-1" />
              <span className="truncate">{donor.district}, {donor.upazila}</span>
            </div>

            <div className="flex items-center space-x-2">
              {getAvailabilityBadge()}
              {donor.lastDonationDate && (
                <span className="text-xs text-gray-500">
                  Last: {lastDonationDate}
                </span>
              )}
            </div>
          </div>
        </div>

        {showContact && isAvailable() && (
          <button
            onClick={handleContactClick}
            className="mt-3 w-full py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
          >
            Contact Donor
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center overflow-hidden ring-4 ring-white shadow-sm">
                {donor.avatar ? (
                  <img
                    src={donor.avatar}
                    alt={donor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser className="text-red-600 w-8 h-8" />
                )}
              </div>
              {!isAvailable() && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                  <FiAlertCircle className="text-white w-3 h-3" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-xl font-bold text-gray-900">{donor.name}</h3>
                <BloodGroupBadge bloodGroup={donor.bloodGroup} size="lg" />
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <RoleBadge role={donor.role} />
                <UserStatusBadge status={donor.status} />
                {getAvailabilityBadge()}
              </div>
            </div>
          </div>

          <div className="text-right">
            {donor.totalDonations > 0 && (
              <div className="mb-2">
                <p className="text-2xl font-bold text-red-600">{donor.totalDonations}</p>
                <p className="text-xs text-gray-500">Donations</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FiMapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-900">
                  {donor.district}, {donor.upazila}
                </p>
              </div>
            </div>

            {donor.phone && showContact && (
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <FiPhone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{donor.phone}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {showContact && (
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <FiMail className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900 truncate">{donor.email}</p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <FiDroplet className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Donation</p>
                <p className="font-medium text-gray-900">{lastDonationDate}</p>
              </div>
            </div>
          </div>
        </div>

        {showFullInfo && donor.additionalInfo && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-2">Additional Information</p>
            <p className="text-gray-700">{donor.additionalInfo}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          {showContact && isAvailable() && (
            <button
              onClick={handleContactClick}
              className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <FiPhone className="w-5 h-5" />
              <span>Contact Donor</span>
            </button>
          )}

          {showActions && (
            <button
              onClick={handleActionClick}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              {actionLabel}
            </button>
          )}

          <button
            onClick={() => setShowFullInfo(!showFullInfo)}
            className="px-4 py-3 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
          >
            {showFullInfo ? 'Show Less' : 'Show More Info'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonorCard;

