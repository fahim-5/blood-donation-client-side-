import api from './api';

export const authService = {
  // Login user
  login: (credentials) => {
    return api.post('/auth/login', credentials);
  },

  // Register user
  register: (userData) => {
    return api.post('/auth/register', userData);
  },

  // Verify token
  verifyToken: () => {
    return api.get('/auth/verify');
  },

  // Update profile
  updateProfile: (data) => {
    return api.put('/auth/profile', data);
  },

  // Get current user
  getCurrentUser: () => {
    return api.get('/auth/me');
  },

  // Check if email exists
  checkEmail: (email) => {
    return api.post('/auth/check-email', { email });
  }
};