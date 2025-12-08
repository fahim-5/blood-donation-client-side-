import React, { useState } from 'react';
import { FaClock, FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaSave, FaUndo, FaEnvelope, FaPhone, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import useDonations from '../../../hooks/useDonations';

const RequestStatusUpdate = ({ request, onStatusUpdate }) => {
  const { updateDonationStatus, sendNotification, loading } = useDonations();
  
  const [selectedStatus, setSelectedStatus] = useState(request.status);
  const [updateNotes, setUpdateNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const statusOptions = [
    {
      value: 'pending',
      label: 'Pending',
      description: 'Awaiting donor response',
      icon: <FaClock className="text-xl" />,
      color: 'bg-yellow-100 text-yellow-800',
      availableFrom: ['inprogress', 'canceled']
    },
    {
      value: 'inprogress',
      label: 'In Progress',
      description: 'Donor assigned, donation in process',
      icon: <FaExclamationTriangle className="text-xl" />,
      color: 'bg-blue-100 text-blue-800',
      availableFrom: ['pending']
    },
    {
      value: 'done',
      label: 'Done',
      description: 'Blood donation completed successfully',
      icon: <FaCheckCircle className="text-xl" />,
      color: 'bg-green-100 text-green-800',
      availableFrom: ['inprogress']
    },
    {
      value: 'canceled',
      label: 'Canceled',
      description: 'Request cancelled by requester',
      icon: <FaTimesCircle className="text-xl" />,
      color: 'bg-red-100 text-red-800',
      availableFrom: ['pending', 'inprogress']
    }
  ];

  const currentStatus = statusOptions.find(opt => opt.value === request.status);
  const availableStatuses = statusOptions.filter(opt => 
    opt.availableFrom.includes(request.status) || opt.value === request.status
  );

  const handleStatusUpdate = async () => {
    if (selectedStatus === request.status) {
      alert('Please select a different status');
      return;
    }

    setIsSaving(true);
    try {
      await updateDonationStatus(request._id, selectedStatus, updateNotes);
      setSuccessMessage('Status updated successfully!');
      setConfirmModalOpen(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
      // Refresh parent component
      if (onStatusUpdate) {
        onStatusUpdate();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendNotification = async () => {
    if (!notificationMessage.trim()) {
      alert('Please enter a notification message');
      return;
    }

    setIsSendingNotification(true);
    try {
      await sendNotification(request._id, notificationMessage);
      setNotificationModalOpen(false);
      setNotificationMessage('');
      setSuccessMessage('Notification sent successfully!');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Failed to send notification:', error);
    } finally {
      setIsSendingNotification(false);
    }
  };

  const getStatusChangeImpact = () => {
    const newStatus = statusOptions.find(opt => opt.value === selectedStatus);
    
    if (selectedStatus === 'done') {
      return {
        title: 'Mark as Completed',
        message: 'This will close the request and mark it as successfully completed. The donor will be notified.',
        type: 'success'
      };
    } else if (selectedStatus === 'canceled') {
      return {
        title: 'Cancel Request',
        message: 'This will cancel the request. Any assigned donor will be notified and the request will be closed.',
        type: 'warning'
      };
    } else if (selectedStatus === 'inprogress') {
      return {
        title: 'Mark as In Progress',
        message: 'This will indicate that a donor has been assigned and the donation process has started.',
        type: 'info'
      };
    } else {
      return {
        title: 'Mark as Pending',
        message: 'This will return the request to pending status, awaiting donor response.',
        type: 'info'
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg"
        >
          {successMessage}
        </motion.div>
      )}

      {/* Current Status */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="bg-white border border-gray-200 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${currentStatus.color}`}>
              {currentStatus.icon}
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">{currentStatus.label}</h4>
              <p className="text-gray-600">{currentStatus.description}</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date(request.updatedAt || request.createdAt).toLocaleString()}
          </div>
        </div>
      </motion.div>

      {/* Status Update Form */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.1 }}
        className="bg-white border border-gray-200 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
        
        <div className="space-y-6">
          {/* Status Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select New Status
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {availableStatuses.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setSelectedStatus(status.value)}
                  className={`p-4 rounded-xl border-2 transition-all ${selectedStatus === status.value ? status.color + ' border-current' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status.color}`}>
                      {status.icon}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">{status.label}</div>
                      <div className="text-xs text-gray-600 mt-1">{status.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Update Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Notes (Optional)
            </label>
            <textarea
              value={updateNotes}
              onChange={(e) => setUpdateNotes(e.target.value)}
              placeholder="Add any notes about this status change (visible to requester and donor)"
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              These notes will be visible to the requester and assigned donor.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              onClick={() => setNotificationModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <FaEnvelope /> Send Notification
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedStatus(request.status);
                  setUpdateNotes('');
                }}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                <FaUndo /> Reset
              </button>
              
              <button
                onClick={() => setConfirmModalOpen(true)}
                disabled={selectedStatus === request.status || isSaving}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <LoadingSpinner size="small" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Update Status
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Assigned Donor Info */}
      {request.donor && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaUser className="text-blue-600" />
            Assigned Donor Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                  {request.donor.name?.charAt(0) || 'D'}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{request.donor.name}</div>
                  <div className="text-sm text-gray-700">{request.donor.email}</div>
                </div>
              </div>
              
              <div className="text-sm text-gray-700">
                <div className="font-medium mb-1">Contact Information:</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-gray-400" />
                    <a href={`mailto:${request.donor.email}`} className="text-blue-600 hover:text-blue-800">
                      {request.donor.email}
                    </a>
                  </div>
                  {request.donor.phone && (
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-gray-400" />
                      <a href={`tel:${request.donor.phone}`} className="text-blue-600 hover:text-blue-800">
                        {request.donor.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm text-gray-700">
                <div className="font-medium mb-1">Donor Details:</div>
                <div className="space-y-1">
                  <div>Blood Group: <span className="font-semibold">{request.donor.bloodGroup}</span></div>
                  <div>Location: <span className="font-semibold">{request.donor.district}, {request.donor.upazila}</span></div>
                  {request.donor.lastDonation && (
                    <div>Last Donation: <span className="font-semibold">
                      {new Date(request.donor.lastDonation).toLocaleDateString()}
                    </span></div>
                  )}
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => window.open(`mailto:${request.donor.email}?subject=Update on Blood Donation Request&body=Hello ${request.donor.name},%0D%0A%0D%0AThis is an update regarding the blood donation request for ${request.recipientName}.`)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Contact Donor
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Status Change Impact */}
      {selectedStatus !== request.status && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center flex-shrink-0">
              <FaExclamationTriangle className="text-xl text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {getStatusChangeImpact().title}
              </h3>
              <p className="text-gray-700 mb-4">
                {getStatusChangeImpact().message}
              </p>
              <div className="text-sm text-gray-600">
                <strong>Note:</strong> This action will notify the requester and assigned donor (if any).
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Status History */}
      {request.statusHistory && request.statusHistory.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.3 }}
          className="bg-white border border-gray-200 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status History</h3>
          <div className="space-y-4">
            {request.statusHistory.map((history, index) => {
              const statusInfo = statusOptions.find(opt => opt.value === history.status);
              return (
                <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusInfo?.color || 'bg-gray-100'}`}>
                    {statusInfo?.icon || <FaClock className="text-gray-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900">{statusInfo?.label || history.status}</span>
                        {history.updatedBy && (
                          <span className="text-sm text-gray-600 ml-2">by {history.updatedBy.name}</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(history.timestamp).toLocaleString()}
                      </div>
                    </div>
                    {history.notes && (
                      <p className="text-gray-600 text-sm mt-1">{history.notes}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleStatusUpdate}
        title={getStatusChangeImpact().title}
        message={getStatusChangeImpact().message}
        confirmText={isSaving ? "Updating..." : "Confirm Update"}
        confirmColor="bg-red-600 hover:bg-red-700"
        isLoading={isSaving}
      />

      {/* Notification Modal */}
      <ConfirmationModal
        isOpen={notificationModalOpen}
        onClose={() => {
          setNotificationModalOpen(false);
          setNotificationMessage('');
        }}
        onConfirm={handleSendNotification}
        title="Send Notification"
        customContent={
          <div className="space-y-4">
            <p className="text-gray-700">
              Send a notification to the requester and assigned donor (if any).
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notification Message
              </label>
              <textarea
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                placeholder="Enter notification message..."
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
        }
        confirmText={isSendingNotification ? "Sending..." : "Send Notification"}
        confirmColor="bg-blue-600 hover:bg-blue-700"
        isLoading={isSendingNotification}
      />
    </div>
  );
};

export default RequestStatusUpdate;