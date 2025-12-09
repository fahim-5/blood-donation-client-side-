import { useState, useEffect } from 'react';
import profileService from '../services/profileService';
import useAuth from './useAuth';

const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, updateUser } = useAuth();

  useEffect(() => {
    if (user) {
      setProfile(user);
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await profileService.getProfile();
      
      if (response.success) {
        setProfile(response.data);
        updateUser(response.data);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch profile');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await profileService.updateProfile(profileData);
      
      if (response.success) {
        setProfile(response.data);
        updateUser(response.data);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (imageFile) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await profileService.uploadAvatar(imageFile);
      
      if (response.success) {
        setProfile(prev => ({ ...prev, avatar: response.data.avatarUrl }));
        updateUser({ avatar: response.data.avatarUrl });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to upload avatar');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getDonationHistory = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await profileService.getDonationHistory(params);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch donation history');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getActivityLog = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await profileService.getActivityLog(params);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch activity log');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await profileService.getStats();
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch profile stats');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateNotificationSettings = async (settings) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await profileService.updateNotificationSettings(settings);
      
      if (response.success) {
        setProfile(prev => ({ 
          ...prev, 
          notificationSettings: response.data.notificationSettings 
        }));
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to update notification settings');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getNotificationSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await profileService.getNotificationSettings();
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch notification settings');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    uploadAvatar,
    getDonationHistory,
    getActivityLog,
    getStats,
    updateNotificationSettings,
    getNotificationSettings,
    setError
  };
};

export default useProfile;