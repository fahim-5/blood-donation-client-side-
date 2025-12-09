import { USER_ROLES, DONATION_STATUS, USER_STATUS } from './constants';

/**
 * Check if user has specific role
 * @param {Object} user - User object
 * @param {string} role - Role to check
 * @returns {boolean}
 */
export const hasRole = (user, role) => {
  return user?.role === role;
};

/**
 * Check if user has any of the specified roles
 * @param {Object} user - User object
 * @param {string[]} roles - Array of roles
 * @returns {boolean}
 */
export const hasAnyRole = (user, roles) => {
  return roles.includes(user?.role);
};

/**
 * Check if user is admin
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const isAdmin = (user) => {
  return hasRole(user, USER_ROLES.ADMIN);
};

/**
 * Check if user is donor
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const isDonor = (user) => {
  return hasRole(user, USER_ROLES.DONOR);
};

/**
 * Check if user is volunteer
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const isVolunteer = (user) => {
  return hasRole(user, USER_ROLES.VOLUNTEER);
};

/**
 * Check if user is active
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const isUserActive = (user) => {
  return user?.status === USER_STATUS.ACTIVE;
};

/**
 * Check if donation is editable
 * @param {Object} donation - Donation object
 * @returns {boolean}
 */
export const isDonationEditable = (donation) => {
  return donation?.status === DONATION_STATUS.PENDING;
};

/**
 * Check if donation can be donated to
 * @param {Object} donation - Donation object
 * @returns {boolean}
 */
export const canDonateTo = (donation) => {
  return donation?.status === DONATION_STATUS.PENDING;
};

/**
 * Check if donation status can be changed
 * @param {string} currentStatus - Current status
 * @param {string} newStatus - New status
 * @returns {boolean}
 */
export const canChangeDonationStatus = (currentStatus, newStatus) => {
  const allowedTransitions = {
    [DONATION_STATUS.PENDING]: [DONATION_STATUS.INPROGRESS, DONATION_STATUS.CANCELED],
    [DONATION_STATUS.INPROGRESS]: [DONATION_STATUS.DONE, DONATION_STATUS.CANCELED],
    [DONATION_STATUS.DONE]: [],
    [DONATION_STATUS.CANCELED]: [],
  };
  
  return allowedTransitions[currentStatus]?.includes(newStatus) || false;
};

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string}
 */
export const getInitials = (name) => {
  if (!name) return 'U';
  
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string}
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.slice(0, maxLength) + '...';
};

/**
 * Generate random ID
 * @param {number} length - Length of ID
 * @returns {string}
 */
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function}
 */
export const debounce = (func, delay) => {
  let timeoutId;
  
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function}
 */
export const throttle = (func, limit) => {
  let inThrottle;
  
  return (...args) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object}
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Merge objects deeply
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @returns {Object}
 */
export const deepMerge = (target, source) => {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  
  return output;
};

/**
 * Check if value is object
 * @param {any} item - Value to check
 * @returns {boolean}
 */
export const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

/**
 * Remove null/undefined values from object
 * @param {Object} obj - Object to clean
 * @returns {Object}
 */
export const removeEmptyValues = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v != null && v !== '')
  );
};

/**
 * Group array by key
 * @param {Array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {Object}
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Sort array by key
 * @param {Array} array - Array to sort
 * @param {string} key - Key to sort by
 * @param {string} order - Sort order (asc/desc)
 * @returns {Array}
 */
export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];
    
    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Filter array by multiple criteria
 * @param {Array} array - Array to filter
 * @param {Object} filters - Filter criteria
 * @returns {Array}
 */
export const filterBy = (array, filters) => {
  return array.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return true;
      }
      
      if (Array.isArray(value)) {
        return value.includes(item[key]);
      }
      
      if (typeof value === 'function') {
        return value(item[key]);
      }
      
      return item[key] === value;
    });
  });
};

/**
 * Get unique values from array
 * @param {Array} array - Array to process
 * @param {string} key - Key to get unique values from
 * @returns {Array}
 */
export const getUniqueValues = (array, key) => {
  return [...new Set(array.map(item => item[key]))];
};

/**
 * Calculate percentage
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @returns {number}
 */
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>}
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text:', err);
    return false;
  }
};

/**
 * Get query parameters from URL
 * @param {string} url - URL string
 * @returns {Object}
 */
export const getQueryParams = (url) => {
  const params = {};
  const urlObj = new URL(url);
  
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
};

/**
 * Generate query string from object
 * @param {Object} params - Parameters object
 * @returns {string}
 */
export const generateQueryString = (params) => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });
  
  return searchParams.toString();
};

/**
 * Delay execution
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise}
 */
export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Generate password
 * @param {number} length - Password length
 * @returns {string}
 */
export const generatePassword = (length = 12) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
};

/**
 * Generate random number in range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number}
 */
export const randomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default {
  hasRole,
  hasAnyRole,
  isAdmin,
  isDonor,
  isVolunteer,
  isUserActive,
  isDonationEditable,
  canDonateTo,
  canChangeDonationStatus,
  getInitials,
  truncateText,
  generateId,
  debounce,
  throttle,
  deepClone,
  deepMerge,
  isObject,
  removeEmptyValues,
  groupBy,
  sortBy,
  filterBy,
  getUniqueValues,
  calculatePercentage,
  formatFileSize,
  copyToClipboard,
  getQueryParams,
  generateQueryString,
  delay,
  generatePassword,
  randomInRange,
};