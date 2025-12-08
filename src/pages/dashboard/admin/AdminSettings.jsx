import React, { useState, useEffect } from 'react';
import { FaCog, FaSave, FaUndo, FaBell, FaShieldAlt, FaDatabase, FaUserShield, FaServer, FaEnvelope, FaGlobe, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import DashboardHeader from '../../../components/ui/DashboardHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import useAdmin from '../../../hooks/useAdmin';

const AdminSettings = () => {
  const { getAdminSettings, updateAdminSettings, loading } = useAdmin();
  
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await getAdminSettings();
      setSettings(data);
      setFormData(data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleChange = (category, key, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // General Settings Validation
    if (formData.general?.siteName && formData.general.siteName.length < 3) {
      newErrors.siteName = 'Site name must be at least 3 characters';
    }
    
    if (formData.general?.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.general.contactEmail)) {
      newErrors.contactEmail = 'Invalid email format';
    }

    // Security Settings Validation
    if (formData.security?.maxLoginAttempts && (formData.security.maxLoginAttempts < 1 || formData.security.maxLoginAttempts > 10)) {
      newErrors.maxLoginAttempts = 'Must be between 1 and 10';
    }

    if (formData.security?.sessionTimeout && (formData.security.sessionTimeout < 15 || formData.security.sessionTimeout > 1440)) {
      newErrors.sessionTimeout = 'Must be between 15 minutes and 24 hours';
    }

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
      await updateAdminSettings(formData);
      setSuccessMessage('Settings saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFormData(settings);
    setResetModalOpen(false);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <FaCog /> },
    { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
    { id: 'security', label: 'Security', icon: <FaShieldAlt /> },
    { id: 'system', label: 'System', icon: <FaServer /> }
  ];

  if (loading && !settings) {
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
        title="Admin Settings"
        subtitle="Configure platform settings and preferences"
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

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-6 text-sm font-medium border-b-2 ${activeTab === tab.id ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaGlobe className="text-red-600" />
                  General Settings
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={formData.general?.siteName || ''}
                      onChange={(e) => handleChange('general', 'siteName', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.siteName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.siteName && (
                      <p className="text-red-500 text-sm mt-1">{errors.siteName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={formData.general?.contactEmail || ''}
                      onChange={(e) => handleChange('general', 'contactEmail', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.contactEmail ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.contactEmail && (
                      <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Description
                    </label>
                    <textarea
                      value={formData.general?.siteDescription || ''}
                      onChange={(e) => handleChange('general', 'siteDescription', e.target.value)}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maintenance Mode
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.general?.maintenanceMode || false}
                        onChange={(e) => handleChange('general', 'maintenanceMode', e.target.checked)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">
                        Enable maintenance mode
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      When enabled, only admins can access the site
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FaCog className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Important Note
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Changes to general settings affect all users. Site name and description are visible
                        on the public pages. Maintenance mode should only be enabled during updates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaBell className="text-blue-600" />
                  Notification Settings
                </h3>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Email Notifications</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">New User Registration</div>
                          <div className="text-sm text-gray-600">Send email when new users register</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.notifications?.emailNewUser || false}
                          onChange={(e) => handleChange('notifications', 'emailNewUser', e.target.checked)}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">New Donation Request</div>
                          <div className="text-sm text-gray-600">Send email for new donation requests</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.notifications?.emailNewRequest || false}
                          onChange={(e) => handleChange('notifications', 'emailNewRequest', e.target.checked)}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">Critical Blood Need</div>
                          <div className="text-sm text-gray-600">Send email for critical blood needs</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.notifications?.emailCriticalNeed || false}
                          onChange={(e) => handleChange('notifications', 'emailCriticalNeed', e.target.checked)}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">In-App Notifications</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">Push Notifications</div>
                          <div className="text-sm text-gray-600">Enable push notifications for urgent requests</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.notifications?.pushEnabled || false}
                          onChange={(e) => handleChange('notifications', 'pushEnabled', e.target.checked)}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Notification Sound
                        </label>
                        <select
                          value={formData.notifications?.sound || 'default'}
                          onChange={(e) => handleChange('notifications', 'sound', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="default">Default</option>
                          <option value="urgent">Urgent</option>
                          <option value="gentle">Gentle</option>
                          <option value="none">None</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaShieldAlt className="text-green-600" />
                  Security Settings
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Login Attempts
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.security?.maxLoginAttempts || 5}
                      onChange={(e) => handleChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.maxLoginAttempts ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.maxLoginAttempts && (
                      <p className="text-red-500 text-sm mt-1">{errors.maxLoginAttempts}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Number of failed login attempts before account lock
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      min="15"
                      max="1440"
                      value={formData.security?.sessionTimeout || 60}
                      onChange={(e) => handleChange('security', 'sessionTimeout', parseInt(e.target.value))}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.sessionTimeout ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.sessionTimeout && (
                      <p className="text-red-500 text-sm mt-1">{errors.sessionTimeout}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Time before automatic logout due to inactivity
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password Policy
                    </label>
                    <select
                      value={formData.security?.passwordPolicy || 'medium'}
                      onChange={(e) => handleChange('security', 'passwordPolicy', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="low">Low (6+ characters)</option>
                      <option value="medium">Medium (8+ characters, mix of letters and numbers)</option>
                      <option value="high">High (10+ characters, special characters required)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Two-Factor Authentication
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.security?.twoFactorEnabled || false}
                        onChange={(e) => handleChange('security', 'twoFactorEnabled', e.target.checked)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">
                        Require 2FA for admin accounts
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Adds an extra layer of security for admin accounts
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FaLock className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Security Warning
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>
                        Changing security settings can affect user access and platform security.
                        Ensure changes are carefully considered and communicated to users if necessary.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaServer className="text-purple-600" />
                  System Settings
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data Backup Frequency
                    </label>
                    <select
                      value={formData.system?.backupFrequency || 'daily'}
                      onChange={(e) => handleChange('system', 'backupFrequency', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                    <p className="text-sm text-gray-500 mt-1">
                      How often to backup system data
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cache Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="1440"
                      value={formData.system?.cacheDuration || 30}
                      onChange={(e) => handleChange('system', 'cacheDuration', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      How long to cache data for performance
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Log Retention (days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={formData.system?.logRetention || 30}
                      onChange={(e) => handleChange('system', 'logRetention', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      How long to keep system logs
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Auto Cleanup Old Requests
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.system?.autoCleanup || false}
                        onChange={(e) => handleChange('system', 'autoCleanup', e.target.checked)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">
                        Automatically archive completed requests older than 30 days
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FaDatabase className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Database Information
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <div className="grid grid-cols-2 gap-2">
                        <div>Total Users:</div>
                        <div className="font-medium">{settings?.systemInfo?.totalUsers || 0}</div>
                        <div>Total Requests:</div>
                        <div className="font-medium">{settings?.systemInfo?.totalRequests || 0}</div>
                        <div>Database Size:</div>
                        <div className="font-medium">{settings?.systemInfo?.dbSize || '0 MB'}</div>
                        <div>Last Backup:</div>
                        <div className="font-medium">{settings?.systemInfo?.lastBackup || 'Never'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
            <button
              onClick={() => setResetModalOpen(true)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium"
              disabled={isSaving}
            >
              <FaUndo /> Reset to Default
            </button>

            <div className="flex gap-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <LoadingSpinner size="small" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Reset Confirmation Modal */}
      <ConfirmationModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleReset}
        title="Reset Settings"
        message="Are you sure you want to reset all settings to their default values? This action cannot be undone."
        confirmText="Reset"
        confirmColor="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default AdminSettings;