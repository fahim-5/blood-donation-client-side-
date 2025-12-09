import { useState, useEffect } from 'react';
import dashboardService from '../services/dashboardService';
import useAuth from './useAuth';

const useDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonations: 0,
    totalFunding: 0,
    pendingRequests: 0,
    activeDonors: 0,
    completedDonations: 0
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dashboardService.getDashboardData();
      
      if (response.success) {
        setStats(response.data.stats || {});
        setRecentActivity(response.data.recentActivity || []);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getAdminStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dashboardService.getAdminStats();
      
      if (response.success) {
        setStats(response.data);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch admin stats');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getDonorStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dashboardService.getDonorStats();
      
      if (response.success) {
        setStats(response.data);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch donor stats');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getVolunteerStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dashboardService.getVolunteerStats();
      
      if (response.success) {
        setStats(response.data);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch volunteer stats');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getChartData = async (period = 'monthly') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dashboardService.getChartData(period);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch chart data');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getRecentDonations = async (limit = 5) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dashboardService.getRecentDonations(limit);
      
      if (response.success) {
        setRecentActivity(response.data);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch recent donations');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getQuickStats = async () => {
    try {
      if (user?.role === 'admin') {
        return getAdminStats();
      } else if (user?.role === 'volunteer') {
        return getVolunteerStats();
      } else {
        return getDonorStats();
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const refreshDashboard = () => {
    fetchDashboardData();
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  return {
    stats,
    recentActivity,
    loading,
    error,
    fetchDashboardData,
    getAdminStats,
    getDonorStats,
    getVolunteerStats,
    getChartData,
    getRecentDonations,
    getQuickStats,
    refreshDashboard,
    setError
  };
};

export default useDashboard;