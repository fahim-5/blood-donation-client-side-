import { useState, useEffect, useCallback } from 'react';
import donationService from '../services/donationService';

const useDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const fetchDonations = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await donationService.getDonations({
        page: params.page || pagination.page,
        limit: params.limit || pagination.limit,
        ...params
      });
      
      if (response.success) {
        setDonations(response.data.donations || []);
        setPagination({
          page: response.data.page || 1,
          limit: response.data.limit || 10,
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 0
        });
      } else {
        throw new Error(response.message || 'Failed to fetch donations');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  const createDonation = async (donationData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await donationService.createDonation(donationData);
      
      if (response.success) {
        await fetchDonations();
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to create donation');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateDonation = async (id, donationData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await donationService.updateDonation(id, donationData);
      
      if (response.success) {
        await fetchDonations();
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to update donation');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteDonation = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await donationService.deleteDonation(id);
      
      if (response.success) {
        await fetchDonations();
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to delete donation');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateDonationStatus = async (id, status, donorId = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await donationService.updateStatus(id, { status, donorId });
      
      if (response.success) {
        await fetchDonations();
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to update donation status');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getDonationById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await donationService.getDonationById(id);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch donation');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const searchDonations = async (filters) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await donationService.searchDonations(filters);
      
      if (response.success) {
        setDonations(response.data || []);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to search donations');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getMyDonations = async (params = {}) => {
    return fetchDonations({ ...params, myDonations: true });
  };

  const getRecentDonations = async (limit = 3) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await donationService.getDonations({
        limit,
        sort: '-createdAt'
      });
      
      if (response.success) {
        return { success: true, data: response.data.donations || [] };
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

  const changePage = (page) => {
    setPagination(prev => ({ ...prev, page }));
    fetchDonations({ page });
  };

  const changeLimit = (limit) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
    fetchDonations({ limit, page: 1 });
  };

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  return {
    donations,
    loading,
    error,
    pagination,
    fetchDonations,
    createDonation,
    updateDonation,
    deleteDonation,
    updateDonationStatus,
    getDonationById,
    searchDonations,
    getMyDonations,
    getRecentDonations,
    changePage,
    changeLimit,
    setError
  };
};

export default useDonations;