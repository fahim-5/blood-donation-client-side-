import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaHospital, FaTint, FaCalendar, FaClock, FaFileAlt, FaArrowLeft, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import DashboardHeader from '../../../components/ui/DashboardHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import LocationSelect from '../../../components/ui/LocationSelect';
import useAuth from '../../../hooks/useAuth';
import useDonations from '../../../hooks/useDonations';
import useLocationData from '../../../hooks/useLocationData';

const CreateDonationRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createDonationRequest, loading } = useDonations();
  const { districts, upazilas, loading: locationLoading } = useLocationData();

  const [formData, setFormData] = useState({
    recipientName: '',
    recipientDistrict: '',
    recipientUpazila: '',
    hospitalName: '',
    fullAddress: '',
    bloodGroup: '',
    donationDate: '',
    donationTime: '',
    requestMessage: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({
      ...prev,
      donationDate: today
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.recipientName.trim()) newErrors.recipientName = 'Recipient name is required';
    if (!formData.recipientDistrict) newErrors.recipientDistrict = 'District is required';
    if (!formData.recipientUpazila) newErrors.recipientUpazila = 'Upazila is required';
    if (!formData.hospitalName.trim()) newErrors.hospitalName = 'Hospital name is required';
    if (!formData.fullAddress.trim()) newErrors.fullAddress = 'Full address is required';
    if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
    if (!formData.donationDate) newErrors.donationDate = 'Donation date is required';
    if (!formData.donationTime) newErrors.donationTime = 'Donation time is required';
    if (!formData.requestMessage.trim()) newErrors.requestMessage = 'Request message is required';

    // Date validation
    if (formData.donationDate) {
      const selectedDate = new Date(formData.donationDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.donationDate = 'Date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const requestData = {
        ...formData,
        requesterName: user?.name,
        requesterEmail: user?.email
      };

      await createDonationRequest(requestData);
      
      // Show success message
      setSuccess(true);
      
      // Redirect after delay
      setTimeout(() => {
        navigate('/dashboard/my-donation-requests');
      }, 2000);
    } catch (error) {
      setErrors({ general: error.message || 'Failed to create donation request. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (locationLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const filteredUpazilas = upazilas.filter(upazila => 
    !formData.recipientDistrict || upazila.district_id === formData.recipientDistrict
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader
        title="Create Donation Request"
        subtitle="Request blood for someone in need"
        showBackButton={true}
        backUrl="/dashboard"
      />

      {success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-sm border border-green-200 p-8 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheck className="text-2xl text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Request Created Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Your blood donation request has been submitted. Donors will be notified and can respond to your request.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard/my-donation-requests')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              View My Requests
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Blood Donation Request Form
            </h2>
            <p className="text-gray-600 mt-1">
              Fill in the details below to create a blood donation request
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {errors.general}
              </div>
            )}

            <div className="space-y-6">
              {/* Requester Info (Read Only) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requester Name
                  </label>
                  <div className="flex items-center gap-3">
                    <FaUser className="text-gray-400" />
                    <input
                      type="text"
                      value={user?.name || ''}
                      readOnly
                      className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requester Email
                  </label>
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-gray-400" />
                    <input
                      type="email"
                      value={user?.email || ''}
                      readOnly
                      className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Recipient Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recipient Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recipient Name *
                    </label>
                    <input
                      type="text"
                      name="recipientName"
                      value={formData.recipientName}
                      onChange={handleChange}
                      placeholder="Enter recipient's full name"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${errors.recipientName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.recipientName && (
                      <p className="text-red-500 text-sm mt-1">{errors.recipientName}</p>
                    )}
                  </div>

                  {/* Location */}
                  <LocationSelect
                    districts={districts}
                    upazilas={filteredUpazilas}
                    selectedDistrict={formData.recipientDistrict}
                    selectedUpazila={formData.recipientUpazila}
                    onDistrictChange={(value) => handleChange({ target: { name: 'recipientDistrict', value } })}
                    onUpazilaChange={(value) => handleChange({ target: { name: 'recipientUpazila', value } })}
                    districtLabel="Recipient District *"
                    upazilaLabel="Recipient Upazila *"
                    errors={errors}
                  />
                </div>
              </div>

              {/* Hospital Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hospital Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hospital Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaHospital className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="hospitalName"
                        value={formData.hospitalName}
                        onChange={handleChange}
                        placeholder="e.g., Dhaka Medical College Hospital"
                        className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${errors.hospitalName ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    </div>
                    {errors.hospitalName && (
                      <p className="text-red-500 text-sm mt-1">{errors.hospitalName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none top-3">
                        <FaMapMarkerAlt className="text-gray-400" />
                      </div>
                      <textarea
                        name="fullAddress"
                        value={formData.fullAddress}
                        onChange={handleChange}
                        placeholder="Enter complete hospital address with road and area details"
                        rows="3"
                        className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${errors.fullAddress ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    </div>
                    {errors.fullAddress && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullAddress}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Donation Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Blood Group */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blood Group Required *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaTint className="text-gray-400" />
                      </div>
                      <select
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${errors.bloodGroup ? 'border-red-500' : 'border-gray-300'}`}
                      >
                        <option value="">Select Blood Group</option>
                        {bloodGroups.map(group => (
                          <option key={group} value={group}>{group}</option>
                        ))}
                      </select>
                    </div>
                    {errors.bloodGroup && (
                      <p className="text-red-500 text-sm mt-1">{errors.bloodGroup}</p>
                    )}
                  </div>

                  {/* Donation Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Donation Date *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaCalendar className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="donationDate"
                        value={formData.donationDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${errors.donationDate ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    </div>
                    {errors.donationDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.donationDate}</p>
                    )}
                  </div>

                  {/* Donation Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Donation Time *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaClock className="text-gray-400" />
                      </div>
                      <input
                        type="time"
                        name="donationTime"
                        value={formData.donationTime}
                        onChange={handleChange}
                        className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${errors.donationTime ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    </div>
                    {errors.donationTime && (
                      <p className="text-red-500 text-sm mt-1">{errors.donationTime}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Request Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Message *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none top-3">
                    <FaFileAlt className="text-gray-400" />
                  </div>
                  <textarea
                    name="requestMessage"
                    value={formData.requestMessage}
                    onChange={handleChange}
                    placeholder="Explain why blood is needed, patient's condition, any special requirements, etc."
                    rows="4"
                    className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${errors.requestMessage ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                {errors.requestMessage && (
                  <p className="text-red-500 text-sm mt-1">{errors.requestMessage}</p>
                )}
                <p className="text-gray-500 text-sm mt-2">
                  Provide detailed information to help donors understand the urgency and requirements.
                </p>
              </div>

              {/* Important Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Important Information
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Ensure all information provided is accurate and complete</li>
                        <li>You will be contacted by potential donors directly</li>
                        <li>Update request status promptly when donation is completed</li>
                        <li>Only active users can create donation requests</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  <FaArrowLeft /> Back to Dashboard
                </button>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard/my-donation-requests')}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting || loading ? (
                      <>
                        <LoadingSpinner size="small" />
                        Creating Request...
                      </>
                    ) : (
                      <>
                        <FaCheck />
                        Create Donation Request
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default CreateDonationRequest;