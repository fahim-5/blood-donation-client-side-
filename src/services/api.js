import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bloodToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      localStorage.removeItem('bloodToken');
      window.location.href = '/login';
    }
    
    // Handle 403 Forbidden errors
    if (error.response?.status === 403) {
      // User is blocked or doesn't have permission
      if (error.response?.data?.message?.includes('blocked')) {
        localStorage.removeItem('bloodToken');
        window.location.href = '/blocked';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;