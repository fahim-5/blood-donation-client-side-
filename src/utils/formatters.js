import { BLOOD_GROUP_LABELS, USER_ROLES, USER_STATUS, DONATION_STATUS } from './constants';

/**
 * Format date to display format
 * @param {string|Date} date - Date to format
 * @param {string} format - Format string
 * @returns {string} - Formatted date
 */
export const formatDate = (date, format = 'MMM DD, YYYY') => {
  if (!date) return '';
  
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Invalid Date';
  }
  
  const formats = {
    'YYYY': d.getFullYear(),
    'MM': String(d.getMonth() + 1).padStart(2, '0'),
    'DD': String(d.getDate()).padStart(2, '0'),
    'HH': String(d.getHours()).padStart(2, '0'),
    'hh': String(d.getHours() % 12 || 12).padStart(2, '0'),
    'mm': String(d.getMinutes()).padStart(2, '0'),
    'ss': String(d.getSeconds()).padStart(2, '0'),
    'A': d.getHours() < 12 ? 'AM' : 'PM',
    'MMM': d.toLocaleString('default', { month: 'short' }),
    'MMMM': d.toLocaleString('default', { month: 'long' }),
    'ddd': d.toLocaleString('default', { weekday: 'short' }),
    'dddd': d.toLocaleString('default', { weekday: 'long' }),
  };
  
  return format.replace(
    /YYYY|MM|DD|HH|hh|mm|ss|A|MMM|MMMM|ddd|dddd/g,
    match => formats[match] || match
  );
};

/**
 * Format time ago
 * @param {string|Date} date - Date to format
 * @returns {string} - Relative time
 */
export const formatTimeAgo = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);
  
  if (seconds < 60) {
    return 'just now';
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  
  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  
  return formatDate(date, 'MMM DD, YYYY');
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @param {string} locale - Locale string
 * @returns {string} - Formatted currency
 */
export const formatCurrency = (amount, currency = 'BDT', locale = 'en-BD') => {
  if (amount === undefined || amount === null) return '';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format number with commas
 * @param {number} number - Number to format
 * @param {number} decimals - Decimal places
 * @returns {string} - Formatted number
 */
export const formatNumber = (number, decimals = 0) => {
  if (number === undefined || number === null) return '';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
};

/**
 * Format percentage
 * @param {number} value - Percentage value
 * @param {number} decimals - Decimal places
 * @returns {string} - Formatted percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === undefined || value === null) return '';
  
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

/**
 * Format blood group
 * @param {string} bloodGroup - Blood group code
 * @returns {string} - Formatted blood group
 */
export const formatBloodGroup = (bloodGroup) => {
  return BLOOD_GROUP_LABELS[bloodGroup] || bloodGroup || 'Unknown';
};

/**
 * Format user role
 * @param {string} role - User role
 * @returns {string} - Formatted role
 */
export const formatUserRole = (role) => {
  const roleLabels = {
    [USER_ROLES.ADMIN]: 'Administrator',
    [USER_ROLES.DONOR]: 'Donor',
    [USER_ROLES.VOLUNTEER]: 'Volunteer',
  };
  
  return roleLabels[role] || role || 'Unknown';
};

/**
 * Format user status
 * @param {string} status - User status
 * @returns {string} - Formatted status
 */
export const formatUserStatus = (status) => {
  const statusLabels = {
    [USER_STATUS.ACTIVE]: 'Active',
    [USER_STATUS.BLOCKED]: 'Blocked',
    [USER_STATUS.PENDING]: 'Pending',
    [USER_STATUS.INACTIVE]: 'Inactive',
  };
  
  return statusLabels[status] || status || 'Unknown';
};

/**
 * Format donation status
 * @param {string} status - Donation status
 * @returns {string} - Formatted status
 */
export const formatDonationStatus = (status) => {
  const statusLabels = {
    [DONATION_STATUS.PENDING]: 'Pending',
    [DONATION_STATUS.INPROGRESS]: 'In Progress',
    [DONATION_STATUS.DONE]: 'Completed',
    [DONATION_STATUS.CANCELED]: 'Canceled',
  };
  
  return statusLabels[status] || status || 'Unknown';
};

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format phone number
 * @param {string} phone - Phone number
 * @param {string} format - Format pattern
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phone, format = '(###) ###-####') => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  let formatted = '';
  let index = 0;
  
  for (let i = 0; i < format.length; i++) {
    if (format[i] === '#' && cleaned[index]) {
      formatted += cleaned[index];
      index++;
    } else if (cleaned[index]) {
      formatted += format[i];
    }
  }
  
  return formatted;
};

/**
 * Format location
 * @param {string} district - District name
 * @param {string} upazila - Upazila name
 * @returns {string} - Formatted location
 */
export const formatLocation = (district, upazila) => {
  if (!district && !upazila) return '';
  
  if (district && upazila) {
    return `${upazila}, ${district}`;
  }
  
  return district || upazila;
};

/**
 * Format full name
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @returns {string} - Full name
 */
export const formatFullName = (firstName, lastName) => {
  if (!firstName && !lastName) return '';
  
  return [firstName, lastName].filter(Boolean).join(' ');
};

/**
 * Format address
 * @param {Object} address - Address object
 * @returns {string} - Formatted address
 */
export const formatAddress = (address) => {
  if (!address) return '';
  
  const parts = [
    address.street,
    address.city,
    address.state,
    address.zipCode,
    address.country,
  ].filter(Boolean);
  
  return parts.join(', ');
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {boolean} showTooltip - Whether to show tooltip on hover
 * @returns {Object} - Truncated text and tooltip
 */
export const truncateText = (text, maxLength = 100, showTooltip = false) => {
  if (!text) return { text: '', tooltip: '' };
  
  if (text.length <= maxLength) {
    return { text, tooltip: showTooltip ? text : '' };
  }
  
  const truncated = text.slice(0, maxLength) + '...';
  return { text: truncated, tooltip: showTooltip ? text : '' };
};

/**
 * Format social security number
 * @param {string} ssn - Social security number
 * @returns {string} - Formatted SSN
 */
export const formatSSN = (ssn) => {
  if (!ssn) return '';
  
  const cleaned = ssn.replace(/\D/g, '');
  
  if (cleaned.length <= 3) {
    return cleaned;
  } else if (cleaned.length <= 5) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  } else {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5, 9)}`;
  }
};

/**
 * Format credit card number
 * @param {string} cardNumber - Credit card number
 * @returns {string} - Formatted card number
 */
export const formatCreditCard = (cardNumber) => {
  if (!cardNumber) return '';
  
  const cleaned = cardNumber.replace(/\D/g, '');
  const parts = cleaned.match(/.{1,4}/g);
  
  return parts ? parts.join(' ') : '';
};

/**
 * Format expiration date
 * @param {string} month - Month (MM)
 * @param {string} year - Year (YYYY)
 * @returns {string} - Formatted expiration date
 */
export const formatExpirationDate = (month, year) => {
  if (!month || !year) return '';
  
  return `${month.padStart(2, '0')}/${year.slice(-2)}`;
};

/**
 * Format time duration
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted duration
 */
export const formatDuration = (seconds) => {
  if (!seconds && seconds !== 0) return '';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts = [];
  
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  
  if (secs > 0 || parts.length === 0) {
    parts.push(`${secs}s`);
  }
  
  return parts.join(' ');
};

/**
 * Format list as sentence
 * @param {Array} items - List of items
 * @param {string} conjunction - Conjunction word
 * @returns {string} - Formatted sentence
 */
export const formatList = (items, conjunction = 'and') => {
  if (!items || items.length === 0) return '';
  
  if (items.length === 1) {
    return items[0];
  }
  
  if (items.length === 2) {
    return `${items[0]} ${conjunction} ${items[1]}`;
  }
  
  const last = items.pop();
  return `${items.join(', ')}, ${conjunction} ${last}`;
};

/**
 * Format boolean value
 * @param {boolean} value - Boolean value
 * @param {Object} options - Format options
 * @returns {string} - Formatted boolean
 */
export const formatBoolean = (value, options = {}) => {
  const defaults = {
    trueText: 'Yes',
    falseText: 'No',
    nullText: 'N/A',
  };
  
  const config = { ...defaults, ...options };
  
  if (value === null || value === undefined) {
    return config.nullText;
  }
  
  return value ? config.trueText : config.falseText;
};

/**
 * Format social media handle
 * @param {string} handle - Social media handle
 * @param {string} platform - Platform name
 * @returns {string} - Formatted handle
 */
export const formatSocialHandle = (handle, platform) => {
  if (!handle) return '';
  
  const prefixes = {
    twitter: '@',
    instagram: '@',
    facebook: '',
    linkedin: '',
    github: '@',
  };
  
  const prefix = prefixes[platform.toLowerCase()] || '';
  return `${prefix}${handle.replace(/^@/, '')}`;
};

/**
 * Format rating stars
 * @param {number} rating - Rating value (0-5)
 * @param {number} maxStars - Maximum stars
 * @returns {string} - Star representation
 */
export const formatRating = (rating, maxStars = 5) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = maxStars - fullStars - (halfStar ? 1 : 0);
  
  return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
};

/**
 * Format progress percentage
 * @param {number} current - Current value
 * @param {number} total - Total value
 * @returns {string} - Formatted progress
 */
export const formatProgress = (current, total) => {
  if (total === 0) return '0%';
  
  const percentage = Math.round((current / total) * 100);
  return `${percentage}%`;
};

export default {
  formatDate,
  formatTimeAgo,
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatBloodGroup,
  formatUserRole,
  formatUserStatus,
  formatDonationStatus,
  formatFileSize,
  formatPhoneNumber,
  formatLocation,
  formatFullName,
  formatAddress,
  truncateText,
  formatSSN,
  formatCreditCard,
  formatExpirationDate,
  formatDuration,
  formatList,
  formatBoolean,
  formatSocialHandle,
  formatRating,
  formatProgress,
};