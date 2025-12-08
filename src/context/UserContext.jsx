// client/src/context/UserContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { userService } from '../services/userService';
import { toast } from 'react-hot-toast';

const UserContext = createContext();

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const { user: currentUser, token, getAuthHeaders } = useAuth();
  
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    donors: 0,
    volunteers: 0,
    admins: 0,
    active: 0,
    blocked: 0,
    newThisWeek: 0,
    growthRate: 0
  });
  
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    bloodGroup: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0
  });

  // Fetch users on mount or when filters/pagination change
  useEffect(() => {
    if (currentUser?.role === 'admin' || currentUser?.role === 'volunteer') {
      fetchUsers();
    }
  }, [filters, pagination.page, pagination.limit, currentUser]);

  // Apply filters to users
  useEffect(() => {
    if (users.length > 0) {
      applyFilters();
    }
  }, [users, filters]);

  const fetchUsers = async (forceRefresh = false) => {
    if (!token || (!currentUser?.role === 'admin' && !currentUser?.role === 'volunteer')) {
      return;
    }

    try {
      setLoading(true);
      
      const queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.role !== 'all' && { role: filters.role }),
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.bloodGroup !== 'all' && { bloodGroup: filters.bloodGroup }),
        ...(filters.search && { search: filters.search }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      };

      const response = await userService.getAllUsers(queryParams, getAuthHeaders());
      
      setUsers(response.users || []);
      setFilteredUsers(response.users || []);
      
      setPagination(prev => ({
        ...prev,
        totalPages: response.totalPages || 1,
        totalItems: response.totalItems || 0
      }));

      if (response.stats) {
        setStats(response.stats);
      }

      if (forceRefresh) {
        toast.success('Users list refreshed');
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error(error.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...users];

    // Apply role filter
    if (filters.role !== 'all') {
      filtered = filtered.filter(user => user.role === filters.role);
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(user => user.status === filters.status);
    }

    // Apply blood group filter
    if (filters.bloodGroup !== 'all') {
      filtered = filtered.filter(user => user.bloodGroup === filters.bloodGroup);
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.district?.toLowerCase().includes(searchLower) ||
        user.upazila?.toLowerCase().includes(searchLower)
      );
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

    setFilteredUsers(filtered);
  }, [users, filters]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const updatePagination = (updates) => {
    setPagination(prev => ({ ...prev, ...updates }));
  };

  const getUserById = async (userId) => {
    try {
      const user = await userService.getUserById(userId, getAuthHeaders());
      return user;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      toast.error(error.response?.data?.message || 'Failed to load user');
      throw error;
    }
  };

  const updateUser = async (userId, updates) => {
    if (!currentUser?.role === 'admin') {
      toast.error('Unauthorized: Only admins can update users');
      return { success: false };
    }

    try {
      setUpdating(true);
      const updatedUser = await userService.updateUser(userId, updates, getAuthHeaders());
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, ...updatedUser } : user
      ));
      
      // Update filtered users
      setFilteredUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, ...updatedUser } : user
      ));

      toast.success('User updated successfully');
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error(error.response?.data?.message || 'Failed to update user');
      return { success: false, error: error.message };
    } finally {
      setUpdating(false);
    }
  };

  const updateUserStatus = async (userId, status) => {
    return updateUser(userId, { status });
  };

  const updateUserRole = async (userId, role) => {
    return updateUser(userId, { role });
  };

  const deleteUser = async (userId) => {
    if (!currentUser?.role === 'admin') {
      toast.error('Unauthorized: Only admins can delete users');
      return { success: false };
    }

    try {
      setUpdating(true);
      await userService.deleteUser(userId, getAuthHeaders());
      
      // Remove from local state
      setUsers(prev => prev.filter(user => user._id !== userId));
      setFilteredUsers(prev => prev.filter(user => user._id !== userId));

      // Update stats
      setStats(prev => ({
        ...prev,
        total: prev.total - 1,
        ...(users.find(u => u._id === userId)?.role === 'donor' && { donors: prev.donors - 1 }),
        ...(users.find(u => u._id === userId)?.role === 'volunteer' && { volunteers: prev.volunteers - 1 }),
        ...(users.find(u => u._id === userId)?.role === 'admin' && { admins: prev.admins - 1 }),
        ...(users.find(u => u._id === userId)?.status === 'active' && { active: prev.active - 1 }),
        ...(users.find(u => u._id === userId)?.status === 'blocked' && { blocked: prev.blocked - 1 })
      }));

      toast.success('User deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
      return { success: false, error: error.message };
    } finally {
      setUpdating(false);
    }
  };

  const searchUsers = async (searchTerm) => {
    try {
      setLoading(true);
      const results = await userService.searchUsers(searchTerm, getAuthHeaders());
      return results;
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Search failed');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getDonorsByLocation = async (district, upazila, bloodGroup) => {
    try {
      setLoading(true);
      const donors = await userService.getDonorsByLocation(
        { district, upazila, bloodGroup },
        getAuthHeaders()
      );
      return donors;
    } catch (error) {
      console.error('Failed to fetch donors by location:', error);
      toast.error('Failed to load donors');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const exportUsers = async (format = 'csv') => {
    try {
      const data = await userService.exportUsers(format, getAuthHeaders());
      
      // Create download link
      const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success(`Users exported as ${format.toUpperCase()}`);
      return { success: true };
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export users');
      return { success: false, error: error.message };
    }
  };

  const getUserActivity = async (userId, timeRange = 'monthly') => {
    try {
      const activity = await userService.getUserActivity(userId, timeRange, getAuthHeaders());
      return activity;
    } catch (error) {
      console.error('Failed to fetch user activity:', error);
      throw error;
    }
  };

  const getTopDonors = async (limit = 10) => {
    try {
      const topDonors = await userService.getTopDonors(limit, getAuthHeaders());
      return topDonors;
    } catch (error) {
      console.error('Failed to fetch top donors:', error);
      return [];
    }
  };

  const getBloodGroupStats = async () => {
    try {
      const stats = await userService.getBloodGroupStats(getAuthHeaders());
      return stats;
    } catch (error) {
      console.error('Failed to fetch blood group stats:', error);
      return {};
    }
  };

  const sendNotificationToUser = async (userId, notification) => {
    try {
      await userService.sendNotification(userId, notification, getAuthHeaders());
      toast.success('Notification sent successfully');
      return { success: true };
    } catch (error) {
      console.error('Failed to send notification:', error);
      toast.error('Failed to send notification');
      return { success: false, error: error.message };
    }
  };

  const value = {
    // State
    users,
    filteredUsers,
    loading,
    updating,
    stats,
    filters,
    pagination,
    
    // Actions
    fetchUsers,
    getUserById,
    updateUser,
    updateUserStatus,
    updateUserRole,
    deleteUser,
    searchUsers,
    getDonorsByLocation,
    exportUsers,
    getUserActivity,
    getTopDonors,
    getBloodGroupStats,
    sendNotificationToUser,
    
    // Filter & Pagination
    updateFilters,
    updatePagination,
    
    // Utilities
    refreshUsers: () => fetchUsers(true),
    
    // Computed values
    canManageUsers: currentUser?.role === 'admin' || currentUser?.role === 'volunteer',
    isAdmin: currentUser?.role === 'admin',
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};