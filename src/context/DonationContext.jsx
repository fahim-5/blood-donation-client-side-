// client/src/context/DonationContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { donationService } from '../services/donationService';
import { toast } from 'react-hot-toast';

const DonationContext = createContext();

export const useDonations = () => {
  const context = useContext(DonationContext);
  if (!context) {
    throw new Error('useDonations must be used within a DonationProvider');
  }
  return context;
};

export const DonationProvider = ({ children }) => {
  const { user: currentUser, token, getAuthHeaders } = useAuth();
  
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inprogress: 0,
    done: 0,
    cancelled: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0
  });

  const [filters, setFilters] = useState({
    status: 'all',
    bloodGroup: 'all',
    district: 'all',
    upazila: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    dateRange: {
      start: null,
      end: null
    }
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0
  });

  // Current donation for editing/viewing
  const [currentDonation, setCurrentDonation] = useState(null);

  // Fetch donations on mount or when filters/pagination change
  useEffect(() => {
    if (currentUser) {
      fetchDonations();
    }
  }, [filters, pagination.page, pagination.limit, currentUser]);

  // Apply filters to donations
  useEffect(() => {
    if (donations.length > 0) {
      applyFilters();
    }
  }, [donations, filters]);

  const fetchDonations = async (forceRefresh = false) => {
    if (!token || !currentUser) return;

    try {
      setLoading(true);
      
      const queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.bloodGroup !== 'all' && { bloodGroup: filters.bloodGroup }),
        ...(filters.district !== 'all' && { district: filters.district }),
        ...(filters.upazila !== 'all' && { upazila: filters.upazila }),
        ...(filters.search && { search: filters.search }),
        ...(filters.dateRange.start && { startDate: filters.dateRange.start }),
        ...(filters.dateRange.end && { endDate: filters.dateRange.end }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      };

      let response;
      
      if (currentUser.role === 'admin' || currentUser.role === 'volunteer') {
        response = await donationService.getAllDonations(queryParams, getAuthHeaders());
      } else {
        response = await donationService.getMyDonations(queryParams, getAuthHeaders());
      }
      
      setDonations(response.donations || []);
      setFilteredDonations(response.donations || []);
      
      setPagination(prev => ({
        ...prev,
        totalPages: response.totalPages || 1,
        totalItems: response.totalItems || 0
      }));

      if (response.stats) {
        setStats(response.stats);
      }

      if (forceRefresh) {
        toast.success('Donations list refreshed');
      }
    } catch (error) {
      console.error('Failed to fetch donations:', error);
      toast.error(error.response?.data?.message || 'Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...donations];

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(donation => donation.status === filters.status);
    }

    // Apply blood group filter
    if (filters.bloodGroup !== 'all') {
      filtered = filtered.filter(donation => donation.bloodGroup === filters.bloodGroup);
    }

    // Apply district filter
    if (filters.district !== 'all') {
      filtered = filtered.filter(donation => donation.recipientDistrict === filters.district);
    }

    // Apply upazila filter
    if (filters.upazila !== 'all') {
      filtered = filtered.filter(donation => donation.recipientUpazila === filters.upazila);
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(donation =>
        donation.recipientName.toLowerCase().includes(searchLower) ||
        donation.hospitalName?.toLowerCase().includes(searchLower) ||
        donation.requestMessage?.toLowerCase().includes(searchLower) ||
        donation.requester?.name?.toLowerCase().includes(searchLower) ||
        donation.requester?.email?.toLowerCase().includes(searchLower)
      );
    }

    // Apply date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter(donation => {
        const donationDate = new Date(donation.donationDate);
        const start = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
        const end = filters.dateRange.end ? new Date(filters.dateRange.end) : null;

        if (start && end) {
          return donationDate >= start && donationDate <= end;
        } else if (start) {
          return donationDate >= start;
        } else if (end) {
          return donationDate <= end;
        }
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[filters.sortBy];
      const bValue = b[filters.sortBy];
      
      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredDonations(filtered);
  }, [donations, filters]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const updatePagination = (updates) => {
    setPagination(prev => ({ ...prev, ...updates }));
  };

  const getDonationById = async (donationId) => {
    try {
      const donation = await donationService.getDonationById(donationId, getAuthHeaders());
      setCurrentDonation(donation);
      return donation;
    } catch (error) {
      console.error('Failed to fetch donation:', error);
      toast.error(error.response?.data?.message || 'Failed to load donation');
      throw error;
    }
  };

  const createDonation = async (donationData) => {
    if (!currentUser || currentUser.status === 'blocked') {
      toast.error('Your account is blocked. Cannot create donation requests.');
      return { success: false };
    }

    try {
      setUpdating(true);
      const newDonation = await donationService.createDonation(donationData, getAuthHeaders());
      
      // Add to local state
      setDonations(prev => [newDonation, ...prev]);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        total: prev.total + 1,
        pending: prev.pending + 1
      }));

      toast.success('Donation request created successfully');
      return { success: true, donation: newDonation };
    } catch (error) {
      console.error('Failed to create donation:', error);
      toast.error(error.response?.data?.message || 'Failed to create donation request');
      return { success: false, error: error.message };
    } finally {
      setUpdating(false);
    }
  };

  const updateDonation = async (donationId, updates) => {
    try {
      setUpdating(true);
      const updatedDonation = await donationService.updateDonation(
        donationId, 
        updates, 
        getAuthHeaders()
      );
      
      // Update local state
      setDonations(prev => prev.map(donation => 
        donation._id === donationId ? { ...donation, ...updatedDonation } : donation
      ));
      
      // Update filtered donations
      setFilteredDonations(prev => prev.map(donation => 
        donation._id === donationId ? { ...donation, ...updatedDonation } : donation
      ));

      // Update current donation if it's the one being updated
      if (currentDonation?._id === donationId) {
        setCurrentDonation(updatedDonation);
      }

      // Update stats based on status change
      if (updates.status) {
        const oldStatus = donations.find(d => d._id === donationId)?.status;
        if (oldStatus && oldStatus !== updates.status) {
          setStats(prev => ({
            ...prev,
            [oldStatus]: Math.max(0, prev[oldStatus] - 1),
            [updates.status]: (prev[updates.status] || 0) + 1
          }));
        }
      }

      toast.success('Donation updated successfully');
      return { success: true, donation: updatedDonation };
    } catch (error) {
      console.error('Failed to update donation:', error);
      toast.error(error.response?.data?.message || 'Failed to update donation');
      return { success: false, error: error.message };
    } finally {
      setUpdating(false);
    }
  };

  const updateDonationStatus = async (donationId, status, reason = '') => {
    const updates = { status };
    if (reason) updates.reason = reason;
    
    return updateDonation(donationId, updates);
  };

  const deleteDonation = async (donationId) => {
    try {
      setUpdating(true);
      const donationToDelete = donations.find(d => d._id === donationId);
      
      await donationService.deleteDonation(donationId, getAuthHeaders());
      
      // Remove from local state
      setDonations(prev => prev.filter(donation => donation._id !== donationId));
      setFilteredDonations(prev => prev.filter(donation => donation._id !== donationId));

      // Update stats
      if (donationToDelete) {
        setStats(prev => ({
          ...prev,
          total: prev.total - 1,
          [donationToDelete.status]: Math.max(0, prev[donationToDelete.status] - 1)
        }));
      }

      // Clear current donation if it's the one being deleted
      if (currentDonation?._id === donationId) {
        setCurrentDonation(null);
      }

      toast.success('Donation request deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('Failed to delete donation:', error);
      toast.error(error.response?.data?.message || 'Failed to delete donation request');
      return { success: false, error: error.message };
    } finally {
      setUpdating(false);
    }
  };

  const assignDonor = async (donationId, donorId) => {
    try {
      const response = await donationService.assignDonor(
        donationId, 
        donorId, 
        getAuthHeaders()
      );
      
      // Update local state
      setDonations(prev => prev.map(donation => 
        donation._id === donationId ? { ...donation, donor: response.donor, status: 'inprogress' } : donation
      ));
      
      // Update filtered donations
      setFilteredDonations(prev => prev.map(donation => 
        donation._id === donationId ? { ...donation, donor: response.donor, status: 'inprogress' } : donation
      ));

      // Update stats
      setStats(prev => ({
        ...prev,
        pending: Math.max(0, prev.pending - 1),
        inprogress: prev.inprogress + 1
      }));

      toast.success('Donor assigned successfully');
      return { success: true, donation: response };
    } catch (error) {
      console.error('Failed to assign donor:', error);
      toast.error(error.response?.data?.message || 'Failed to assign donor');
      return { success: false, error: error.message };
    }
  };

  const respondToDonation = async (donationId) => {
    if (!currentUser) {
      toast.error('Please login to respond to donation requests');
      return { success: false };
    }

    try {
      const response = await donationService.respondToDonation(
        donationId, 
        getAuthHeaders()
      );
      
      // Update local state
      setDonations(prev => prev.map(donation => 
        donation._id === donationId ? { ...donation, donor: currentUser, status: 'inprogress' } : donation
      ));
      
      // Update filtered donations
      setFilteredDonations(prev => prev.map(donation => 
        donation._id === donationId ? { ...donation, donor: currentUser, status: 'inprogress' } : donation
      ));

      // Update stats
      setStats(prev => ({
        ...prev,
        pending: Math.max(0, prev.pending - 1),
        inprogress: prev.inprogress + 1
      }));

      toast.success('You have successfully responded to the donation request');
      return { success: true, donation: response };
    } catch (error) {
      console.error('Failed to respond to donation:', error);
      toast.error(error.response?.data?.message || 'Failed to respond to donation request');
      return { success: false, error: error.message };
    }
  };

  const getPendingDonations = async (filters = {}) => {
    try {
      const pendingDonations = await donationService.getPendingDonations(
        filters, 
        getAuthHeaders()
      );
      return pendingDonations;
    } catch (error) {
      console.error('Failed to fetch pending donations:', error);
      return [];
    }
  };

  const getUrgentDonations = async (hours = 24) => {
    try {
      const urgentDonations = await donationService.getUrgentDonations(
        hours, 
        getAuthHeaders()
      );
      return urgentDonations;
    } catch (error) {
      console.error('Failed to fetch urgent donations:', error);
      return [];
    }
  };

  const getDonationAnalytics = async (timeRange = 'monthly') => {
    try {
      const analytics = await donationService.getAnalytics(
        timeRange, 
        getAuthHeaders()
      );
      return analytics;
    } catch (error) {
      console.error('Failed to fetch donation analytics:', error);
      return {};
    }
  };

  const getBloodGroupDemand = async () => {
    try {
      const demand = await donationService.getBloodGroupDemand(getAuthHeaders());
      return demand;
    } catch (error) {
      console.error('Failed to fetch blood group demand:', error);
      return {};
    }
  };

  const exportDonations = async (format = 'csv', filters = {}) => {
    try {
      const data = await donationService.exportDonations(
        format, 
        filters, 
        getAuthHeaders()
      );
      
      // Create download link
      const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `donations_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success(`Donations exported as ${format.toUpperCase()}`);
      return { success: true };
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export donations');
      return { success: false, error: error.message };
    }
  };

  const clearCurrentDonation = () => {
    setCurrentDonation(null);
  };

  const value = {
    // State
    donations,
    filteredDonations,
    currentDonation,
    loading,
    updating,
    stats,
    filters,
    pagination,
    
    // Actions
    fetchDonations,
    getDonationById,
    createDonation,
    updateDonation,
    updateDonationStatus,
    deleteDonation,
    assignDonor,
    respondToDonation,
    getPendingDonations,
    getUrgentDonations,
    getDonationAnalytics,
    getBloodGroupDemand,
    exportDonations,
    
    // Filter & Pagination
    updateFilters,
    updatePagination,
    
    // Utilities
    refreshDonations: () => fetchDonations(true),
    clearCurrentDonation,
    
    // Permission checks
    canManageAll: currentUser?.role === 'admin' || currentUser?.role === 'volunteer',
    canCreate: currentUser?.status !== 'blocked',
    canEditOwn: (donation) => 
      donation?.requester?._id === currentUser?._id || 
      currentUser?.role === 'admin',
    canDelete: (donation) => 
      donation?.requester?._id === currentUser?._id || 
      currentUser?.role === 'admin',
    canRespond: (donation) => 
      currentUser?.role === 'donor' && 
      donation?.status === 'pending' && 
      donation?.requester?._id !== currentUser?._id &&
      donation?.bloodGroup === currentUser?.bloodGroup,
    canAssign: currentUser?.role === 'admin' || currentUser?.role === 'volunteer',
  };

  return (
    <DonationContext.Provider value={value}>
      {children}
    </DonationContext.Provider>
  );
};