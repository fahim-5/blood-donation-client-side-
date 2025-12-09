import { useState, useEffect, useCallback } from 'react';
import analyticsService from '../services/analyticsService';

const useStatistics = () => {
  const [statistics, setStatistics] = useState({
    users: {
      total: 0,
      donors: 0,
      volunteers: 0,
      admins: 0,
      active: 0,
      blocked: 0
    },
    donations: {
      total: 0,
      pending: 0,
      inprogress: 0,
      completed: 0,
      canceled: 0,
      today: 0,
      thisWeek: 0,
      thisMonth: 0
    },
    funding: {
      total: 0,
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      average: 0
    },
    locations: {},
    bloodGroups: {},
    trends: {
      daily: [],
      weekly: [],
      monthly: []
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('monthly'); // daily, weekly, monthly

  const fetchStatistics = useCallback(async (range = timeRange) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await analyticsService.getStatistics(range);
      
      if (response.success) {
        setStatistics(response.data);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch statistics');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  const getUserStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await analyticsService.getUserStatistics();
      
      if (response.success) {
        setStatistics(prev => ({
          ...prev,
          users: response.data
        }));
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch user statistics');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getDonationStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await analyticsService.getDonationStatistics();
      
      if (response.success) {
        setStatistics(prev => ({
          ...prev,
          donations: response.data
        }));
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch donation statistics');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getFundingStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await analyticsService.getFundingStatistics();
      
      if (response.success) {
        setStatistics(prev => ({
          ...prev,
          funding: response.data
        }));
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch funding statistics');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getLocationStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await analyticsService.getLocationStatistics();
      
      if (response.success) {
        setStatistics(prev => ({
          ...prev,
          locations: response.data
        }));
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch location statistics');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getBloodGroupStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await analyticsService.getBloodGroupStatistics();
      
      if (response.success) {
        setStatistics(prev => ({
          ...prev,
          bloodGroups: response.data
        }));
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch blood group statistics');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getTrendData = useCallback(async (range = 'monthly') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await analyticsService.getTrendData(range);
      
      if (response.success) {
        setStatistics(prev => ({
          ...prev,
          trends: {
            ...prev.trends,
            [range]: response.data
          }
        }));
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch trend data');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [users, donations, funding] = await Promise.all([
        getUserStatistics(),
        getDonationStatistics(),
        getFundingStatistics()
      ]);
      
      return {
        success: users.success && donations.success && funding.success,
        data: {
          users: users.data,
          donations: donations.data,
          funding: funding.data
        }
      };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [getUserStatistics, getDonationStatistics, getFundingStatistics]);

  const calculateGrowth = useCallback((current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }, []);

  const getTopLocations = useCallback((limit = 5) => {
    const locations = statistics.locations;
    
    if (!locations || typeof locations !== 'object') return [];
    
    return Object.entries(locations)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }, [statistics.locations]);

  const getBloodGroupDistribution = useCallback(() => {
    const bloodGroups = statistics.bloodGroups;
    
    if (!bloodGroups || typeof bloodGroups !== 'object') return [];
    
    const total = Object.values(bloodGroups).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(bloodGroups)
      .map(([group, count]) => ({
        group,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count);
  }, [statistics.bloodGroups]);

  const getDonationStatusDistribution = useCallback(() => {
    const donations = statistics.donations;
    
    return [
      { status: 'Pending', count: donations.pending || 0, color: '#fbbf24' },
      { status: 'In Progress', count: donations.inprogress || 0, color: '#60a5fa' },
      { status: 'Completed', count: donations.completed || 0, color: '#34d399' },
      { status: 'Canceled', count: donations.canceled || 0, color: '#f87171' }
    ];
  }, [statistics.donations]);

  const getUserRoleDistribution = useCallback(() => {
    const users = statistics.users;
    
    return [
      { role: 'Donors', count: users.donors || 0, color: '#ef4444' },
      { role: 'Volunteers', count: users.volunteers || 0, color: '#3b82f6' },
      { role: 'Admins', count: users.admins || 0, color: '#10b981' }
    ];
  }, [statistics.users]);

  const getRecentTrend = useCallback(() => {
    const trends = statistics.trends[timeRange] || [];
    
    if (trends.length < 2) return 0;
    
    const recent = trends[trends.length - 1];
    const previous = trends[trends.length - 2];
    
    return calculateGrowth(recent?.count || 0, previous?.count || 0);
  }, [statistics.trends, timeRange, calculateGrowth]);

  const changeTimeRange = useCallback(async (newRange) => {
    setTimeRange(newRange);
    await getTrendData(newRange);
  }, [getTrendData]);

  const refreshStatistics = useCallback(async () => {
    await fetchStatistics();
  }, [fetchStatistics]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return {
    // State
    statistics,
    loading,
    error,
    timeRange,
    
    // Setters
    setTimeRange: changeTimeRange,
    setError,
    
    // Fetch methods
    fetchStatistics,
    getUserStatistics,
    getDonationStatistics,
    getFundingStatistics,
    getLocationStatistics,
    getBloodGroupStatistics,
    getTrendData,
    getDashboardStats,
    refreshStatistics,
    
    // Calculation methods
    calculateGrowth,
    getTopLocations,
    getBloodGroupDistribution,
    getDonationStatusDistribution,
    getUserRoleDistribution,
    getRecentTrend,
    
    // Derived values
    totalUsers: statistics.users.total,
    totalDonations: statistics.donations.total,
    totalFunding: statistics.funding.total,
    isDataLoaded: !loading && !error
  };
};

export default useStatistics;