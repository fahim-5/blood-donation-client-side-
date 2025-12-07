import { jwtDecode } from 'jwt-decode';

export const jwtUtils = {
  // Decode token
  decodeToken: (token) => {
    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  },

  // Check if token is expired
  isTokenExpired: (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },

  // Get user info from token
  getUserFromToken: (token) => {
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
      return null;
    }
  }
};