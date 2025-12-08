// client/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication on mount and token change
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (token) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          
          // Redirect blocked users
          if (userData?.status === 'blocked') {
            toast.error('Your account has been blocked. Please contact support.');
            logout();
            navigate('/blocked');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid token
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token, navigate]);

  // Auto-logout on token expiration
  useEffect(() => {
    const checkTokenExpiration = () => {
      if (token) {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const expiresAt = tokenData.exp * 1000;
        
        if (Date.now() >= expiresAt) {
          toast.error('Your session has expired. Please login again.');
          logout();
        }
      }
    };

    // Check every minute
    const interval = setInterval(checkTokenExpiration, 60000);
    return () => clearInterval(interval);
  }, [token]);

  // Redirect to intended route after login
  useEffect(() => {
    if (!loading && user) {
      const intendedPath = localStorage.getItem('intendedPath');
      if (intendedPath) {
        localStorage.removeItem('intendedPath');
        navigate(intendedPath);
      }
    }
  }, [user, loading, navigate]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      
      const { user: userData, token: authToken } = response;
      
      // Store token
      localStorage.setItem('token', authToken);
      setToken(authToken);
      setUser(userData);
      
      // Check if user is blocked
      if (userData.status === 'blocked') {
        toast.error('Your account has been blocked. Please contact support.');
        logout();
        return { success: false, error: 'Account blocked' };
      }
      
      toast.success(`Welcome back, ${userData.name}!`);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      
      const { user: newUser, token: authToken } = response;
      
      // Store token
      localStorage.setItem('token', authToken);
      setToken(authToken);
      setUser(newUser);
      
      toast.success('Registration successful! Welcome to BloodDonation.');
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration failed:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    
    // Clear any stored state
    localStorage.removeItem('intendedPath');
    
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  const refreshToken = async () => {
    try {
      const response = await authService.refreshToken();
      const { token: newToken, user: userData } = response;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      return { success: true, token: newToken };
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return { success: false, error: error.message };
    }
  };

  const isAuthenticated = () => {
    return !!user && !!token;
  };

  const hasRole = (requiredRole) => {
    if (!user) return false;
    
    // Admin has access to everything
    if (user.role === 'admin') return true;
    
    // Check specific role
    return user.role === requiredRole;
  };

  const hasAnyRole = (roles) => {
    if (!user) return false;
    
    if (user.role === 'admin') return true;
    
    return roles.includes(user.role);
  };

  const requireAuth = (requiredRole = null) => {
    return (to, from, next) => {
      if (!isAuthenticated()) {
        // Store intended path
        localStorage.setItem('intendedPath', to.path);
        toast.error('Please login to access this page');
        navigate('/login');
        return false;
      }

      if (requiredRole && !hasRole(requiredRole)) {
        toast.error('You do not have permission to access this page');
        navigate('/unauthorized');
        return false;
      }

      return true;
    };
  };

  const getAuthHeaders = () => {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: isAuthenticated(),
    isAdmin: user?.role === 'admin',
    isDonor: user?.role === 'donor',
    isVolunteer: user?.role === 'volunteer',
    isBlocked: user?.status === 'blocked',
    
    // Actions
    login,
    register,
    logout,
    updateUser,
    refreshToken,
    
    // Role checks
    hasRole,
    hasAnyRole,
    
    // Utilities
    requireAuth,
    getAuthHeaders,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
export const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, hasAnyRole, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // Store intended path
        localStorage.setItem('intendedPath', location.pathname + location.search);
        navigate('/login');
      } else if (roles.length > 0 && !hasAnyRole(roles)) {
        navigate('/unauthorized');
      }
    }
  }, [isAuthenticated, hasAnyRole, loading, navigate, location, roles]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || (roles.length > 0 && !hasAnyRole(roles))) {
    return null;
  }

  return children;
};

// Role-based route components
export const AdminRoute = ({ children }) => (
  <ProtectedRoute roles={['admin']}>{children}</ProtectedRoute>
);

export const DonorRoute = ({ children }) => (
  <ProtectedRoute roles={['donor', 'admin']}>{children}</ProtectedRoute>
);

export const VolunteerRoute = ({ children }) => (
  <ProtectedRoute roles={['volunteer', 'admin']}>{children}</ProtectedRoute>
);