import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaTint, FaMapMarkerAlt, FaUpload, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AvatarUpload from '../../components/ui/AvatarUpload';
import LocationSelect from '../../components/ui/LocationSelect';
import useAuth from '../../hooks/useAuth';
import useLocationData from '../../hooks/useLocationData';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { districts, upazilas, loading: locationLoading } = useLocationData();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    bloodGroup: '',
    district: '',
    upazila: '',
    avatar: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formValid, setFormValid] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(1);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const filteredUpazilas = upazilas.filter(upazila => 
    !formData.district || upazila.district_id === formData.district
  );

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (registrationStep === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      
      setFormValid(Object.keys(newErrors).length === 0);
    } else {
      if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
      if (!formData.district) newErrors.district = 'District is required';
      if (!formData.upazila) newErrors.upazila = 'Upazila is required';
      
      setFormValid(Object.keys(newErrors).length === 0);
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    
    // Reset upazila if district changes
    if (name === 'district') {
      setFormData(prev => ({ ...prev, upazila: '' }));
    }
  };

  const handleAvatarUpload = (imageUrl) => {
    setFormData(prev => ({ ...prev, avatar: imageUrl }));
  };

  const handleNextStep = () => {
    if (validateForm() && registrationStep === 1) {
      setRegistrationStep(2);
    }
  };

  const handlePrevStep = () => {
    setRegistrationStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        bloodGroup: formData.bloodGroup,
        district: districts.find(d => d.id === formData.district)?.name || '',
        upazila: filteredUpazilas.find(u => u.id === formData.upazila)?.name || '',
        avatar: formData.avatar
      };

      await register(userData);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setErrors({ general: err.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (locationLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="py-16">
          <LoadingSpinner fullScreen />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-50 via-white to-blue-50">
      <Navbar />
      
      <main className="flex-grow py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${registrationStep >= 1 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                1
              </div>
              <div className={`h-1 w-24 ${registrationStep >= 2 ? 'bg-red-600' : 'bg-gray-200'}`}></div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${registrationStep >= 2 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-600 max-w-xs mx-auto">
              <span className={registrationStep >= 1 ? 'text-red-600 font-semibold' : ''}>
                Account Details
              </span>
              <span className={registrationStep >= 2 ? 'text-red-600 font-semibold' : ''}>
                Personal Information
              </span>
            </div>
          </motion.div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="md:flex">
              {/* Left Side - Information */}
              <div className="md:w-2/5 bg-gradient-to-b from-red-600 to-red-700 text-white p-8 md:p-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-3xl font-bold mb-6">
                    Become a Lifesaver
                  </h2>
                  
                  <div className="space-y-6 mb-8">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaTint className="text-lg" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Save Lives</h3>
                        <p className="text-red-100">
                          Your blood donation can save up to 3 lives
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaMapMarkerAlt className="text-lg" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Local Impact</h3>
                        <p className="text-red-100">
                          Help people in your own community
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaCheckCircle className="text-lg" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Easy Process</h3>
                        <p className="text-red-100">
                          Simple registration, immediate impact
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-3">Already a donor?</h3>
                    <p className="text-red-100 mb-4">
                      Sign in to access your dashboard and manage your donations
                    </p>
                    <Link
                      to="/login"
                      className="inline-block bg-white text-red-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Sign In Now
                    </Link>
                  </div>
                </motion.div>
              </div>

              {/* Right Side - Registration Form */}
              <div className="md:w-3/5 p-8 md:p-12">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                >
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Create Your Account
                    </h1>
                    <p className="text-gray-600">
                      Join our community of lifesaving donors
                    </p>
                  </div>

                  {errors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                      {errors.general}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    {/* Step 1: Account Details */}
                    {registrationStep === 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                      >
                        {/* Name Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
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
                              placeholder="Enter your full name"
                              className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            />
                          </div>
                          {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                          )}
                        </div>

                        {/* Email Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaEnvelope className="text-gray-400" />
                            </div>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="Enter your email"
                              className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            />
                          </div>
                          {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                          )}
                        </div>

                        {/* Password Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaLock className="text-gray-400" />
                            </div>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              placeholder="Create a password (min. 6 characters)"
                              className={`pl-10 pr-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showPassword ? (
                                <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                              ) : (
                                <FaEye className="text-gray-400 hover:text-gray-600" />
                              )}
                            </button>
                          </div>
                          {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                          )}
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaLock className="text-gray-400" />
                            </div>
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              placeholder="Confirm your password"
                              className={`pl-10 pr-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showConfirmPassword ? (
                                <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                              ) : (
                                <FaEye className="text-gray-400 hover:text-gray-600" />
                              )}
                            </button>
                          </div>
                          {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                          )}
                        </div>

                        {/* Next Button */}
                        <button
                          type="button"
                          onClick={handleNextStep}
                          disabled={!formValid}
                          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Continue to Personal Details →
                        </button>
                      </motion.div>
                    )}

                    {/* Step 2: Personal Information */}
                    {registrationStep === 2 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                      >
                        {/* Avatar Upload */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Profile Picture
                          </label>
                          <AvatarUpload
                            onImageUpload={handleAvatarUpload}
                            currentImage={formData.avatar}
                          />
                        </div>

                        {/* Blood Group */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Blood Group *
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
                              <option value="">Select your blood group</option>
                              {bloodGroups.map(group => (
                                <option key={group} value={group}>
                                  {group}
                                </option>
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
                          errors={errors}
                        />

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                          <button
                            type="button"
                            onClick={handlePrevStep}
                            className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-lg font-semibold transition-colors"
                          >
                            ← Back
                          </button>
                          <button
                            type="submit"
                            disabled={loading || !formValid}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {loading ? (
                              <>
                                <LoadingSpinner size="small" />
                                Creating Account...
                              </>
                            ) : (
                              'Complete Registration'
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </form>

                  {/* Terms and Privacy */}
                  <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                    <p className="text-gray-600 text-sm">
                      By registering, you agree to our{' '}
                      <Link to="/terms" className="text-red-600 hover:text-red-700">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-red-600 hover:text-red-700">
                        Privacy Policy
                      </Link>
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;