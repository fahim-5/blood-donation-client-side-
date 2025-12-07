import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  // Get user from token
  const getUserFromToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return {
        _id: decoded._id,
        email: decoded.email,
        name: decoded.name,
        avatar: decoded.avatar,
        bloodGroup: decoded.bloodGroup,
        district: decoded.district,
        upazila: decoded.upazila,
        role: decoded.role || 'donor',
        status: decoded.status || 'active'
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('bloodToken');
        
        if (token && !isTokenExpired(token)) {
          const userData = getUserFromToken(token);
          if (userData) {
            setUser(userData);
            
            // Verify token with server
            try {
              await authService.verifyToken();
            } catch (error) {
              console.log('Token verification failed, logging out...');
              logout();
            }
          }
        } else if (token) {
          // Token expired, clear it
          localStorage.removeItem('bloodToken');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.login({ email, password });
      
      if (response.data.success) {
        const { token, user: userData } = response.data;
        
        // Store token
        localStorage.setItem('bloodToken', token);
        
        // Set user state
        setUser({
          _id: userData._id,
          email: userData.email,
          name: userData.name,
          avatar: userData.avatar,
          bloodGroup: userData.bloodGroup,
          district: userData.district,
          upazila: userData.upazila,
          role: userData.role,
          status: userData.status
        });
        
        return { success: true, data: userData };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.register(userData);
      
      if (response.data.success) {
        const { token, user: newUser } = response.data;
        
        // Store token
        localStorage.setItem('bloodToken', token);
        
        // Set user state
        setUser({
          _id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          avatar: newUser.avatar,
          bloodGroup: newUser.bloodGroup,
          district: newUser.district,
          upazila: newUser.upazila,
          role: newUser.role,
          status: newUser.status
        });
        
        return { success: true, data: newUser };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('bloodToken');
    setUser(null);
    setError(null);
  };

  // Update user profile
  const updateProfile = async (updatedData) => {
    try {
      setLoading(true);
      
      const response = await authService.updateProfile(updatedData);
      
      if (response.data.success) {
        const updatedUser = response.data.user;
        
        // Update user state
        setUser(prev => ({
          ...prev,
          ...updatedUser
        }));
        
        // Update token if new one provided
        if (response.data.token) {
          localStorage.setItem('bloodToken', response.data.token);
        }
        
        return { success: true, data: updatedUser };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Check if user is volunteer
  const isVolunteer = () => {
    return user?.role === 'volunteer';
  };

  // Check if user is donor
  const isDonor = () => {
    return user?.role === 'donor';
  };

  // Check if user is active (not blocked)
  const isActive = () => {
    return user?.status === 'active';
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAdmin,
    isVolunteer,
    isDonor,
    isActive,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

