import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaTint, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaUpload, FaCalendar, FaUserCircle, FaShieldAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import DashboardHeader from '../../../components/ui/DashboardHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import AvatarUpload from '../../../components/ui/AvatarUpload';
import LocationSelect from '../../../components/ui/LocationSelect';
import useAuth from '../../../hooks/useAuth';
import useProfile from '../../../hooks/useProfile';
import useLocationData from '../../../hooks/useLocationData';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { getProfileStats, loading: statsLoading } = useProfile();
  const { districts, upazilas, loading: locationLoading } = useLocationData();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bloodGroup: '',
    district: '',
    upazila: '',
    avatar: ''
  });
  const [originalData, setOriginalData] = useState(null);
  const [profileStats, setProfileStats] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || '',
        email: user.email || '',
        bloodGroup: user.bloodGroup || '',
        district: user.district || '',
        upazila: user.upazila || '',
        avatar: user.avatar || ''
      };
      setFormData(userData);
      setOriginalData(userData);
    }
    fetchProfileStats();
  }, [user]);

  const fetchProfileStats = async () => {
    try {
      const stats = await getProfileStats();
      setProfileStats(stats);
    } catch (error) {
      console.error('Failed to fetch profile stats:', error);
    }
  };

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

  const handleAvatarUpload = (imageUrl) => {
    setFormData(prev => ({ ...prev, avatar: imageUrl }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
    if (!formData.district) newErrors.district = 'District is required';
    if (!formData.upazila) newErrors.upazila = 'Upazila is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setSuccessMessage('');

    try {
      await updateUser(formData);
      setOriginalData(formData);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setErrors({ general: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setErrors({});
  };

  const filteredUpazilas = upazilas.filter(upazila => 
    !formData.district || upazila.district_id === formData.district
  );

  const getDistrictName = () => {
    return districts.find(d => d.id === formData.district)?.name || formData.district;
  };

  const getUpazilaName = () => {
    return filteredUpazilas.find(u => u.id === formData.upazila)?.name || formData.upazila;
  };

  if (locationLoading || !user) {
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
        title="My Profile"
        subtitle="Manage your personal information and preferences"
        showBackButton={true}
        backUrl="/dashboard"
      />

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg"
        >
          {successMessage}
        </motion.div>
      )}

      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errors.general}
        </div>
      )}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
              <div className="flex gap-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <FaEdit /> Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      <FaTimes /> Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <LoadingSpinner size="small" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave /> Save Changes
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
                <div className="flex-shrink-0">
                  <AvatarUpload
                    onImageUpload={handleAvatarUpload}
                    currentImage={formData.avatar}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-4">
                    {isEditing 
                      ? 'Upload a clear photo of yourself. This will be visible to other users when you respond to donation requests.'
                      : 'Your profile picture is visible to other users when you interact with donation requests.'}
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name {isEditing && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${errors.name ? 'border-red-500' : 'border-gray-300'} ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email (Read Only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      readOnly
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Group {isEditing && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaTint className="text-gray-400" />
                    </div>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${errors.bloodGroup ? 'border-red-500' : 'border-gray-300'} ${!isEditing ? 'bg-gray-50' : ''}`}
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

                {/* Location */}
                <LocationSelect
                  districts={districts}
                  upazilas={filteredUpazilas}
                  selectedDistrict={formData.district}
                  selectedUpazila={formData.upazila}
                  onDistrictChange={(value) => handleChange({ target: { name: 'district', value } })}
                  onUpazilaChange={(value) => handleChange({ target: { name: 'upazila', value } })}
                  disabled={!isEditing}
                  errors={errors}
                />
              </div>

              {/* Account Info */}
              <div className="pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Account Type</div>
                    <div className="font-medium text-gray-900 capitalize flex items-center gap-2 mt-1">
                      <FaUserCircle className="text-red-600" />
                      {user.role}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Member Since</div>
                    <div className="font-medium text-gray-900 flex items-center gap-2 mt-1">
                      <FaCalendar className="text-red-600" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                <FaShieldAlt className="text-xl text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Visibility</h3>
                <p className="text-gray-700 mb-3">
                  Your profile information (name, blood group, and location) is visible to other users 
                  when you respond to donation requests or when donors search for potential matches.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Email is never shared publicly</li>
                  <li>• Contact information is only shared when you explicitly agree to donate</li>
                  <li>• You can update your visibility preferences in notification settings</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Stats */}
        <div className="space-y-6">
          {/* Profile Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Impact</h3>
            
            {statsLoading ? (
              <div className="text-center py-8">
                <LoadingSpinner size="medium" />
                <p className="text-gray-500 mt-2">Loading stats...</p>
              </div>
            ) : profileStats ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600">{profileStats.livesSaved || 0}</div>
                  <div className="text-gray-600">Lives Potentially Saved</div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Total Donations</span>
                    <span className="font-semibold text-gray-900">{profileStats.totalDonations || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Requests Created</span>
                    <span className="font-semibold text-gray-900">{profileStats.requestsCreated || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Success Rate</span>
                    <span className="font-semibold text-green-600">
                      {profileStats.successRate || 0}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Active Since</span>
                    <span className="font-semibold text-gray-900">
                      {profileStats.activeDays || 0} days
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">Blood Group Distribution</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Your Group ({formData.bloodGroup})</span>
                      <span className="font-medium">{profileStats.bloodGroupStats?.yourGroup || 0}% of requests</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${profileStats.bloodGroupStats?.yourGroup || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No statistics available yet
              </div>
            )}
          </div>

          {/* Quick Info */}
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Blood Group: {formData.bloodGroup || 'Not Set'}</h3>
            
            {formData.bloodGroup ? (
              <div className="space-y-3">
                <div className="text-sm text-gray-700">
                  <div className="font-medium mb-1">You can donate to:</div>
                  <div className="space-y-1">
                    {getCompatibleRecipients(formData.bloodGroup).map(recipient => (
                      <div key={recipient} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>{recipient}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-700">
                  <div className="font-medium mb-1">You can receive from:</div>
                  <div className="space-y-1">
                    {getCompatibleDonors(formData.bloodGroup).map(donor => (
                      <div key={donor} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{donor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">
                Set your blood group to see compatibility information and help more people.
              </p>
            )}
          </div>

          {/* Location Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-600" />
              Your Location
            </h3>
            
            {formData.district && formData.upazila ? (
              <div className="space-y-3">
                <div className="text-gray-900 font-medium">
                  {getDistrictName()}, {getUpazilaName()}
                </div>
                <p className="text-sm text-gray-600">
                  Your location helps match you with nearby donation requests.
                  {profileStats?.nearbyRequests && (
                    <span className="block mt-1 font-medium">
                      {profileStats.nearbyRequests} active requests in your area
                    </span>
                  )}
                </p>
              </div>
            ) : (
              <p className="text-gray-600">
                Set your location to receive notifications about nearby donation requests.
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Helper functions for blood group compatibility
const getCompatibleRecipients = (bloodGroup) => {
  const compatibility = {
    'A+': ['A+', 'AB+'],
    'A-': ['A+', 'A-', 'AB+', 'AB-'],
    'B+': ['B+', 'AB+'],
    'B-': ['B+', 'B-', 'AB+', 'AB-'],
    'AB+': ['AB+'],
    'AB-': ['AB+', 'AB-'],
    'O+': ['A+', 'B+', 'AB+', 'O+'],
    'O-': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  };
  return compatibility[bloodGroup] || [];
};

const getCompatibleDonors = (bloodGroup) => {
  const compatibility = {
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'A-': ['A-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'AB-': ['A-', 'B-', 'AB-', 'O-'],
    'O+': ['O+', 'O-'],
    'O-': ['O-']
  };
  return compatibility[bloodGroup] || [];
};

export default Profile;