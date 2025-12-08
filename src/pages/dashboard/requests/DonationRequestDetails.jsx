import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTint, FaMapMarkerAlt, FaHospital, FaCalendar, FaClock, FaUser, FaEnvelope, FaPhone, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaArrowLeft, FaShareAlt, FaPrint } from 'react-icons/fa';
import { motion } from 'framer-motion';
import DashboardHeader from '../../../components/ui/DashboardHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import RequestDonorsList from './RequestDonorsList';
import RequestStatusUpdate from './RequestStatusUpdate';
import useAuth from '../../../hooks/useAuth';
import useDonations from '../../../hooks/useDonations';

const DonationRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getDonationRequestById, deleteDonationRequest, loading } = useDonations();
  
  const [request, setRequest] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      const data = await getDonationRequestById(id);
      setRequest(data);
    } catch (error) {
      console.error('Failed to fetch request details:', error);
      navigate('/dashboard');
    }
  };

  const handleDeleteRequest = async () => {
    setIsDeleting(true);
    try {
      await deleteDonationRequest(id);
      navigate('/dashboard/my-donation-requests');
    } catch (error) {
      console.error('Failed to delete request:', error);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
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
      case 'pending': return <FaExclamationTriangle className="text-yellow-600" />;
      case 'inprogress': return <FaClock className="text-blue-600" />;
      case 'done': return <FaCheckCircle className="text-green-600" />;
      case 'canceled': return <FaTimesCircle className="text-red-600" />;
      default: return <FaExclamationTriangle className="text-gray-600" />;
    }
  };

  const isRequestOwner = user?._id === request?.requester?._id;
  const isAdmin = user?.role === 'admin';
  const canEdit = isRequestOwner && request?.status === 'pending';
  const canDelete = (isRequestOwner || isAdmin) && request?.status !== 'inprogress' && request?.status !== 'done';

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const shareText = `Urgent Blood Need: ${request?.bloodGroup} blood required for ${request?.recipientName} at ${request?.hospitalName}. Location: ${request?.recipientDistrict}, ${request?.recipientUpazila}. Date: ${request?.donationDate} at ${request?.donationTime}`;
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: 'Blood Donation Request',
        text: shareText,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n\nView details: ${shareUrl}`);
      alert('Request details copied to clipboard!');
    }
  };

  if (loading && !request) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaTint className="text-2xl text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Request Not Found</h2>
        <p className="text-gray-600 mb-6">The donation request you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader
        title="Donation Request Details"
        subtitle="View complete information about this blood donation request"
        showBackButton={true}
        backUrl={isRequestOwner ? '/dashboard/my-donation-requests' : '/dashboard/all-donation-requests'}
      />

      {/* Quick Actions */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${getStatusColor(request.status)}`}>
            {getStatusIcon(request.status)}
            <span className="font-medium capitalize">{request.status}</span>
          </div>
          <div className="text-sm text-gray-600">
            Created: {new Date(request.createdAt).toLocaleDateString()}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <FaShareAlt /> Share
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <FaPrint /> Print
          </button>
          {canEdit && (
            <button
              onClick={() => navigate(`/dashboard/edit-donation-request/${id}`)}
              className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <FaEdit /> Edit
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <FaTrash /> Delete
            </button>
          )}
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'details' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Request Details
            </button>
            <button
              onClick={() => setActiveTab('donors')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'donors' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Potential Donors
            </button>
            {(isRequestOwner || isAdmin) && (
              <button
                onClick={() => setActiveTab('status')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'status' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Status Management
              </button>
            )}
          </nav>
        </div>

        <div className="p-6">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-8">
              {/* Blood Group Banner */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Blood Group Required</h2>
                    <div className="text-4xl font-bold">{request.bloodGroup}</div>
                    <p className="text-red-100 mt-2">
                      {request.status === 'pending' ? 'Awaiting donor response' : 
                       request.status === 'inprogress' ? 'Donor assigned, awaiting completion' :
                       request.status === 'done' ? 'Blood donation completed successfully' :
                       'Request cancelled'}
                    </p>
                  </div>
                  <div className="text-6xl">
                    <FaTint />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recipient Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <FaUser className="text-red-600" />
                    Recipient Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Recipient Name</div>
                      <div className="font-medium text-gray-900">{request.recipientName}</div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Location</div>
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-gray-400" />
                        {request.recipientDistrict}, {request.recipientUpazila}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hospital Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <FaHospital className="text-blue-600" />
                    Hospital Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Hospital Name</div>
                      <div className="font-medium text-gray-900">{request.hospitalName}</div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Full Address</div>
                      <div className="font-medium text-gray-900">{request.fullAddress}</div>
                    </div>
                  </div>
                </div>

                {/* Donation Details */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <FaCalendar className="text-green-600" />
                    Donation Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Donation Date</div>
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        <FaCalendar className="text-gray-400" />
                        {new Date(request.donationDate).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Donation Time</div>
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        <FaClock className="text-gray-400" />
                        {request.donationTime}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Requester Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <FaUser className="text-purple-600" />
                    Requester Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Requester Name</div>
                      <div className="font-medium text-gray-900">{request.requesterName}</div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Contact Email</div>
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        <FaEnvelope className="text-gray-400" />
                        {request.requesterEmail}
                      </div>
                    </div>

                    {request.createdAt && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 mb-1">Request Submitted</div>
                        <div className="font-medium text-gray-900">
                          {new Date(request.createdAt).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Request Message */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Request Message</h3>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-700 whitespace-pre-line">{request.requestMessage}</p>
                </div>
              </div>

              {/* Assigned Donor (if any) */}
              {request.donor && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Assigned Donor</h3>
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-gray-900 text-lg">{request.donor.name}</div>
                        <div className="text-gray-700">{request.donor.email}</div>
                        <div className="text-gray-600 text-sm mt-2">
                          Blood Group: <span className="font-semibold">{request.donor.bloodGroup}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Contact Donor</div>
                        <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                          <FaPhone className="inline mr-2" />
                          Contact Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Donors Tab */}
          {activeTab === 'donors' && (
            <RequestDonorsList 
              requestId={id}
              bloodGroup={request.bloodGroup}
              district={request.recipientDistrict}
              upazila={request.recipientUpazila}
            />
          )}

          {/* Status Tab */}
          {activeTab === 'status' && (
            <RequestStatusUpdate 
              request={request}
              onStatusUpdate={fetchRequestDetails}
            />
          )}
        </div>
      </motion.div>

      {/* Emergency Contact */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0">
            <FaExclamationTriangle className="text-xl text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Emergency Assistance</h3>
            <p className="text-gray-700 mb-4">
              If this is a critical emergency requiring immediate attention, please contact our 24/7 emergency helpline:
            </p>
            <div className="flex items-center gap-4">
              <div className="bg-white px-6 py-3 rounded-lg border border-red-300">
                <div className="text-2xl font-bold text-red-600">10666</div>
                <div className="text-sm text-gray-600">National Emergency Blood Service</div>
              </div>
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                <FaPhone className="inline mr-2" />
                Call Now
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteRequest}
        title="Delete Donation Request"
        message="Are you sure you want to delete this donation request? This action cannot be undone."
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        confirmColor="bg-red-600 hover:bg-red-700"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DonationRequestDetails;