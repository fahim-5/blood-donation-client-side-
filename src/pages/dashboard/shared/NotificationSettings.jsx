import React, { useState, useEffect } from 'react';
import { 
  FaBell, 
  FaEnvelope, 
  FaMobileAlt, 
  FaSave, 
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import DashboardHeader from '../../../components/ui/DashboardHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import useAuth from '../../../hooks/useAuth';
import useNotifications from '../../../hooks/useNotifications';

const NotificationSettings = () => {
  const { user } = useAuth();
  const { updateNotificationSettings, getNotificationSettings } = useNotifications();
  
  const [settings, setSettings] = useState({
    emailNotifications: {
      donationRequests: true,
      donationUpdates: true,
      fundingReceipts: true,
      newsletter: false,
      systemUpdates: true
    },
    pushNotifications: {
      urgentRequests: true,
      requestMatches: true,
      statusUpdates: true,
      fundingAlerts: false
    },
    smsNotifications: {
      urgentAlerts: false,
      appointmentReminders: false,
      verificationCodes: true
    },
    frequency: 'realtime', // realtime, daily, weekly
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const childAnimation = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const savedSettings = await getNotificationSettings();
      if (savedSettings) {
        setSettings(prev => ({
          ...prev,
          ...savedSettings
        }));
      }
    } catch (error) {
      console.error('Failed to load notification settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (category, field) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: !prev[category][field]
      }
    }));
  };

  const handleFrequencyChange = (frequency) => {
    setSettings(prev => ({
      ...prev,
      frequency
    }));
  };

  const handleQuietHoursToggle = () => {
    setSettings(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        enabled: !prev.quietHours.enabled
      }
    }));
  };

  const handleTimeChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveStatus({ type: '', message: '' });

      await updateNotificationSettings(settings);
      
      setSaveStatus({
        type: 'success',
        message: 'Notification settings saved successfully!'
      });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSaveStatus({ type: '', message: '' });
      }, 5000);
    } catch (error) {
      setSaveStatus({
        type: 'error',
        message: error.message || 'Failed to save settings. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSettings({
      emailNotifications: {
        donationRequests: true,
        donationUpdates: true,
        fundingReceipts: true,
        newsletter: false,
        systemUpdates: true
      },
      pushNotifications: {
        urgentRequests: true,
        requestMatches: true,
        statusUpdates: true,
        fundingAlerts: false
      },
      smsNotifications: {
        urgentAlerts: false,
        appointmentReminders: false,
        verificationCodes: true
      },
      frequency: 'realtime',
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading notification settings..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader
        title="Notification Settings"
        subtitle="Manage how and when you receive notifications"
        showBackButton={true}
        backUrl="/dashboard"
      />

      {/* Save Status */}
      {saveStatus.message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`px-4 py-3 rounded-lg border ${
            saveStatus.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center">
            {saveStatus.type === 'success' ? (
              <FaCheckCircle className="mr-2" />
            ) : (
              <FaTimesCircle className="mr-2" />
            )}
            {saveStatus.message}
          </div>
        </motion.div>
      )}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Notification Preferences
          </h2>
          <p className="text-gray-600 mt-1">
            Customize how you receive notifications from the Blood Donation Platform
          </p>
        </div>

        <div className="p-6 space-y-8">
          {/* Email Notifications */}
          <motion.div variants={staggerChildren} className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <FaEnvelope className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
                <p className="text-gray-600 text-sm">Receive notifications via email</p>
              </div>
            </div>

            <motion.div variants={childAnimation} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(settings.emailNotifications).map(([key, value]) => {
                const labels = {
                  donationRequests: 'New Donation Requests',
                  donationUpdates: 'Donation Status Updates',
                  fundingReceipts: 'Funding Receipts',
                  newsletter: 'Newsletter & Updates',
                  systemUpdates: 'System Updates'
                };
                
                return (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-gray-700">{labels[key]}</span>
                    <button
                      onClick={() => handleToggle('emailNotifications', key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-red-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Push Notifications */}
          <motion.div variants={staggerChildren} className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaBell className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Push Notifications</h3>
                <p className="text-gray-600 text-sm">In-app and browser notifications</p>
              </div>
            </div>

            <motion.div variants={childAnimation} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(settings.pushNotifications).map(([key, value]) => {
                const labels = {
                  urgentRequests: 'Urgent Blood Requests',
                  requestMatches: 'Matching Donation Requests',
                  statusUpdates: 'Status Updates',
                  fundingAlerts: 'Funding Campaigns'
                };
                
                return (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-gray-700">{labels[key]}</span>
                    <button
                      onClick={() => handleToggle('pushNotifications', key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* SMS Notifications */}
          <motion.div variants={staggerChildren} className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaMobileAlt className="text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">SMS Notifications</h3>
                <p className="text-gray-600 text-sm">Text message alerts (if phone number provided)</p>
              </div>
            </div>

            <motion.div variants={childAnimation} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(settings.smsNotifications).map(([key, value]) => {
                const labels = {
                  urgentAlerts: 'Urgent Emergency Alerts',
                  appointmentReminders: 'Donation Appointment Reminders',
                  verificationCodes: 'Verification Codes'
                };
                
                return (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-gray-700">{labels[key]}</span>
                    <button
                      onClick={() => handleToggle('smsNotifications', key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Notification Frequency */}
          <motion.div variants={staggerChildren} className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Notification Frequency</h3>
            <p className="text-gray-600 text-sm">Choose how often you receive non-urgent notifications</p>
            
            <motion.div variants={childAnimation} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { value: 'realtime', label: 'Real-time', desc: 'Receive notifications immediately' },
                { value: 'daily', label: 'Daily Digest', desc: 'One summary email per day' },
                { value: 'weekly', label: 'Weekly Digest', desc: 'One summary email per week' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFrequencyChange(option.value)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    settings.frequency === option.value
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                  {settings.frequency === option.value && (
                    <div className="mt-2 flex items-center text-red-600 text-sm">
                      <FaCheckCircle className="mr-1" />
                      Selected
                    </div>
                  )}
                </button>
              ))}
            </motion.div>
          </motion.div>

          {/* Quiet Hours */}
          <motion.div variants={staggerChildren} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Quiet Hours</h3>
                <p className="text-gray-600 text-sm">Pause non-urgent notifications during specific hours</p>
              </div>
              <button
                onClick={handleQuietHoursToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.quietHours.enabled ? 'bg-red-600' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.quietHours.enabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {settings.quietHours.enabled && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={settings.quietHours.start}
                    onChange={(e) => handleTimeChange('start', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={settings.quietHours.end}
                    onChange={(e) => handleTimeChange('end', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Info Note */}
          <motion.div 
            variants={childAnimation}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-start">
              <FaInfoCircle className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Important:</p>
                <p className="mt-1">
                  Urgent blood requests will always be sent regardless of your notification settings.
                  Email is required for account verification and password recovery.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            variants={childAnimation}
            className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200"
          >
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isSaving ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Saving Settings...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Save Notification Settings
                </>
              )}
            </button>
            
            <button
              onClick={handleReset}
              type="button"
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
            >
              Reset to Defaults
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationSettings;