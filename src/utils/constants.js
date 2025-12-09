// Application Constants

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000,
  MAX_RETRIES: 3,
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  DONOR: 'donor',
  VOLUNTEER: 'volunteer',
};

export const ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Administrator',
  [USER_ROLES.DONOR]: 'Donor',
  [USER_ROLES.VOLUNTEER]: 'Volunteer',
};

export const ROLE_COLORS = {
  [USER_ROLES.ADMIN]: 'bg-purple-100 text-purple-800',
  [USER_ROLES.DONOR]: 'bg-red-100 text-red-800',
  [USER_ROLES.VOLUNTEER]: 'bg-blue-100 text-blue-800',
};

// User Status
export const USER_STATUS = {
  ACTIVE: 'active',
  BLOCKED: 'blocked',
  PENDING: 'pending',
  INACTIVE: 'inactive',
};

export const STATUS_LABELS = {
  [USER_STATUS.ACTIVE]: 'Active',
  [USER_STATUS.BLOCKED]: 'Blocked',
  [USER_STATUS.PENDING]: 'Pending',
  [USER_STATUS.INACTIVE]: 'Inactive',
};

export const STATUS_COLORS = {
  [USER_STATUS.ACTIVE]: 'bg-green-100 text-green-800',
  [USER_STATUS.BLOCKED]: 'bg-red-100 text-red-800',
  [USER_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [USER_STATUS.INACTIVE]: 'bg-gray-100 text-gray-800',
};

// Donation Status
export const DONATION_STATUS = {
  PENDING: 'pending',
  INPROGRESS: 'inprogress',
  DONE: 'done',
  CANCELED: 'canceled',
};

export const DONATION_STATUS_LABELS = {
  [DONATION_STATUS.PENDING]: 'Pending',
  [DONATION_STATUS.INPROGRESS]: 'In Progress',
  [DONATION_STATUS.DONE]: 'Completed',
  [DONATION_STATUS.CANCELED]: 'Canceled',
};

export const DONATION_STATUS_COLORS = {
  [DONATION_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [DONATION_STATUS.INPROGRESS]: 'bg-blue-100 text-blue-800',
  [DONATION_STATUS.DONE]: 'bg-green-100 text-green-800',
  [DONATION_STATUS.CANCELED]: 'bg-red-100 text-red-800',
};

// Blood Groups
export const BLOOD_GROUPS = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

export const BLOOD_GROUP_LABELS = {
  'A+': 'A Positive',
  'A-': 'A Negative',
  'B+': 'B Positive',
  'B-': 'B Negative',
  'AB+': 'AB Positive',
  'AB-': 'AB Negative',
  'O+': 'O Positive',
  'O-': 'O Negative',
};

export const BLOOD_GROUP_COLORS = {
  'A+': 'bg-red-100 text-red-800',
  'A-': 'bg-red-200 text-red-900',
  'B+': 'bg-blue-100 text-blue-800',
  'B-': 'bg-blue-200 text-blue-900',
  'AB+': 'bg-purple-100 text-purple-800',
  'AB-': 'bg-purple-200 text-purple-900',
  'O+': 'bg-green-100 text-green-800',
  'O-': 'bg-green-200 text-green-900',
};

// Funding Status
export const FUNDING_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELED: 'canceled',
  PENDING: 'pending',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  DONATION_REQUEST: 'donation_request',
  DONATION_UPDATE: 'donation_update',
  FUNDING_CAMPAIGN: 'funding_campaign',
  SYSTEM_ANNOUNCEMENT: 'system_announcement',
  USER_ACTIVITY: 'user_activity',
  URGENT_REQUEST: 'urgent_request',
};

// Payment Methods
export const PAYMENT_METHODS = {
  STRIPE: 'stripe',
  BKASH: 'bkash',
  NAGAD: 'nagad',
  ROCKET: 'rocket',
  CASH: 'cash',
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  MAX_FILES: 10,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [5, 10, 20, 50, 100],
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  NOTIFICATION_SETTINGS: 'notification_settings',
  SEARCH_HISTORY: 'search_history',
};

// Routes
export const ROUTES = {
  // Public Routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  SEARCH: '/search',
  DONATION_REQUESTS: '/donation-requests',
  CONTACT: '/contact',
  ABOUT: '/about',
  HOW_IT_WORKS: '/how-it-works',
  
  // Dashboard Routes
  DASHBOARD: '/dashboard',
  PROFILE: '/dashboard/profile',
  CHANGE_PASSWORD: '/dashboard/change-password',
  NOTIFICATION_SETTINGS: '/dashboard/notification-settings',
  
  // Donor Routes
  MY_DONATION_REQUESTS: '/dashboard/my-donation-requests',
  CREATE_DONATION_REQUEST: '/dashboard/create-donation-request',
  EDIT_DONATION_REQUEST: '/dashboard/edit-donation-request/:id',
  
  // Admin Routes
  ALL_USERS: '/dashboard/all-users',
  ALL_DONATION_REQUESTS: '/dashboard/all-blood-donation-request',
  ADMIN_SETTINGS: '/dashboard/admin/settings',
  
  // Volunteer Routes
  VOLUNTEER_TASKS: '/dashboard/volunteer/tasks',
  
  // Shared Routes
  FUNDING: '/dashboard/funding',
  DONATION_REQUEST_DETAILS: '/dashboard/requests/:id',
};

// Theme
export const THEME = {
  COLORS: {
    PRIMARY: '#dc2626', // Red-600
    PRIMARY_DARK: '#b91c1c', // Red-700
    SECONDARY: '#3b82f6', // Blue-500
    SUCCESS: '#10b981', // Green-500
    WARNING: '#f59e0b', // Yellow-500
    DANGER: '#ef4444', // Red-500
    INFO: '#06b6d4', // Cyan-500
    LIGHT: '#f8fafc', // Slate-50
    DARK: '#1e293b', // Slate-800
  },
  FONT_SIZES: {
    XS: '0.75rem',
    SM: '0.875rem',
    BASE: '1rem',
    LG: '1.125rem',
    XL: '1.25rem',
    '2XL': '1.5rem',
    '3XL': '1.875rem',
    '4XL': '2.25rem',
  },
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px',
  },
};

// Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL: 'Please enter a valid email address',
  MIN_LENGTH: 'Must be at least {min} characters',
  MAX_LENGTH: 'Must be less than {max} characters',
  PASSWORD_MISMATCH: 'Passwords do not match',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_URL: 'Please enter a valid URL',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access forbidden.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  DEFAULT: 'Something went wrong. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  DONATION_CREATED: 'Donation request created successfully',
  DONATION_UPDATED: 'Donation request updated successfully',
  DONATION_DELETED: 'Donation request deleted successfully',
  USER_BLOCKED: 'User blocked successfully',
  USER_UNBLOCKED: 'User unblocked successfully',
  ROLE_UPDATED: 'User role updated successfully',
  FUNDING_DONATED: 'Thank you for your donation',
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY hh:mm A',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DDTHH:mm:ss',
  TIME: 'hh:mm A',
};

// Export default all constants
export default {
  API_CONFIG,
  USER_ROLES,
  USER_STATUS,
  DONATION_STATUS,
  BLOOD_GROUPS,
  FUNDING_STATUS,
  NOTIFICATION_TYPES,
  PAYMENT_METHODS,
  FILE_UPLOAD,
  PAGINATION,
  STORAGE_KEYS,
  ROUTES,
  THEME,
  VALIDATION_MESSAGES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  DATE_FORMATS,
};