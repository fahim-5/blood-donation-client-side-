import { useState, useEffect, useCallback } from 'react';
import userService from '../services/userService';
import useAuth from './useAuth';

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  
  const { user: currentUser } = useAuth();

  const fetchUsers = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await userService.getUsers({
        page: params.page || pagination.page,
        limit: params.limit || pagination.limit,
        ...params
      });
      
      if (response.success) {
        setUsers(response.data.users || []);
        setPagination({
          page: response.data.page || 1,
          limit: response.data.limit || 10,
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 0
        });
      } else {
        throw new Error(response.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  const getUserById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await userService.getUserById(id);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch user');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await userService.updateUser(id, userData);
      
      if (response.success) {
        await fetchUsers();
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to update user');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const blockUser = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await userService.blockUser(id);
      
      if (response.success) {
        await fetchUsers();
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to block user');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const unblockUser = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await userService.unblockUser(id);
      
      if (response.success) {
        await fetchUsers();
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to unblock user');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const changeUserRole = async (id, role) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await userService.changeRole(id, role);
      
      if (response.success) {
        await fetchUsers();
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to change user role');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const searchDonors = async (filters) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await userService.searchDonors(filters);
      
      if (response.success) {
        return { success: true, data: response.data || [] };
      } else {
        throw new Error(response.message || 'Failed to search donors');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await userService.getStatistics();
      
      if (response.success) {
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
  };

  const getActiveDonors = async (params = {}) => {
    return searchDonors({ ...params, status: 'active' });
  };

  const changePage = (page) => {
    setPagination(prev => ({ ...prev, page }));
    fetchUsers({ page });
  };

  const changeLimit = (limit) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
    fetchUsers({ limit, page: 1 });
  };

  // Check if current user has permission to manage users
  const canManageUsers = () => {
    return currentUser?.role === 'admin';
  };

  const canUpdateRole = () => {
    return currentUser?.role === 'admin';
  };

  useEffect(() => {
    if (canManageUsers()) {
      fetchUsers();
    }
  }, [fetchUsers, canManageUsers]);

  return {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    getUserById,
    updateUser,
    blockUser,
    unblockUser,
    changeUserRole,
    searchDonors,
    getStatistics,
    getActiveDonors,
    changePage,
    changeLimit,
    canManageUsers,
    canUpdateRole,
    setError
  };
};

export default useUsers;