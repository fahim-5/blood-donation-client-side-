import { 
  USER_STATUS, 
  STATUS_LABELS, 
  STATUS_COLORS,
  DONATION_STATUS,
  DONATION_STATUS_LABELS,
  DONATION_STATUS_COLORS 
} from './constants';

/**
 * Status Utility Functions
 * Handles status management and validations
 */

// User Status Functions

/**
 * Get all user statuses
 * @returns {Array} - Array of status objects
 */
export const getAllUserStatuses = () => {
  return Object.values(USER_STATUS).map(status => ({
    value: status,
    label: STATUS_LABELS[status],
    color: STATUS_COLORS[status],
  }));
};

/**
 * Get user status label
 * @param {string} status - Status value
 * @returns {string} - Status label
 */
export const getUserStatusLabel = (status) => {
  return STATUS_LABELS[status] || status || 'Unknown';
};

/**
 * Get user status color classes
 * @param {string} status - Status value
 * @returns {string} - Tailwind CSS classes
 */
export const getUserStatusColor = (status) => {
  return STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
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
 * Check if user is blocked
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const isUserBlocked = (user) => {
  return user?.status === USER_STATUS.BLOCKED;
};

/**
 * Check if user is pending
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const isUserPending = (user) => {
  return user?.status === USER_STATUS.PENDING;
};

/**
 * Check if user is inactive
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const isUserInactive = (user) => {
  return user?.status === USER_STATUS.INACTIVE;
};

/**
 * Check if user can perform actions
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const canUserPerformActions = (user) => {
  if (!user) return false;
  
  return isUserActive(user);
};

/**
 * Check if user can create donation requests
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const canUserCreateDonations = (user) => {
  return canUserPerformActions(user);
};

/**
 * Check if user can donate to requests
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const canUserDonate = (user) => {
  return canUserPerformActions(user);
};

/**
 * Validate user status transition
 * @param {string} currentStatus - Current status
 * @param {string} newStatus - New status
 * @returns {Object} - Validation result
 */
export const validateUserStatusTransition = (currentStatus, newStatus) => {
  const errors = [];
  
  // Check if statuses are valid
  const validStatuses = Object.values(USER_STATUS);
  if (!validStatuses.includes(currentStatus)) {
    errors.push(`Invalid current status: ${currentStatus}`);
  }
  
  if (!validStatuses.includes(newStatus)) {
    errors.push(`Invalid new status: ${newStatus}`);
  }
  
  // Check if transition is allowed
  if (currentStatus === newStatus) {
    errors.push('New status must be different from current status');
  }
  
  // Special rules for blocked status
  if (newStatus === USER_STATUS.BLOCKED) {
    // Can only block from active or pending status
    if (![USER_STATUS.ACTIVE, USER_STATUS.PENDING].includes(currentStatus)) {
      errors.push('Can only block active or pending users');
    }
  }
  
  // Special rules for active status
  if (newStatus === USER_STATUS.ACTIVE) {
    // Can only activate from blocked, pending, or inactive
    if (![USER_STATUS.BLOCKED, USER_STATUS.PENDING, USER_STATUS.INACTIVE].includes(currentStatus)) {
      errors.push('Can only activate blocked, pending, or inactive users');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Donation Status Functions

/**
 * Get all donation statuses
 * @returns {Array} - Array of status objects
 */
export const getAllDonationStatuses = () => {
  return Object.values(DONATION_STATUS).map(status => ({
    value: status,
    label: DONATION_STATUS_LABELS[status],
    color: DONATION_STATUS_COLORS[status],
  }));
};

/**
 * Get donation status label
 * @param {string} status - Status value
 * @returns {string} - Status label
 */
export const getDonationStatusLabel = (status) => {
  return DONATION_STATUS_LABELS[status] || status || 'Unknown';
};

/**
 * Get donation status color classes
 * @param {string} status - Status value
 * @returns {string} - Tailwind CSS classes
 */
export const getDonationStatusColor = (status) => {
  return DONATION_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Check if donation is pending
 * @param {Object} donation - Donation object
 * @returns {boolean}
 */
export const isDonationPending = (donation) => {
  return donation?.status === DONATION_STATUS.PENDING;
};

/**
 * Check if donation is in progress
 * @param {Object} donation - Donation object
 * @returns {boolean}
 */
export const isDonationInProgress = (donation) => {
  return donation?.status === DONATION_STATUS.INPROGRESS;
};

/**
 * Check if donation is completed
 * @param {Object} donation - Donation object
 * @returns {boolean}
 */
export const isDonationCompleted = (donation) => {
  return donation?.status === DONATION_STATUS.DONE;
};

/**
 * Check if donation is canceled
 * @param {Object} donation - Donation object
 * @returns {boolean}
 */
export const isDonationCanceled = (donation) => {
  return donation?.status === DONATION_STATUS.CANCELED;
};

/**
 * Check if donation can be edited
 * @param {Object} donation - Donation object
 * @returns {boolean}
 */
export const canEditDonation = (donation) => {
  return isDonationPending(donation);
};

/**
 * Check if donation can be deleted
 * @param {Object} donation - Donation object
 * @returns {boolean}
 */
export const canDeleteDonation = (donation) => {
  return isDonationPending(donation) || isDonationCanceled(donation);
};

/**
 * Check if donation can be donated to
 * @param {Object} donation - Donation object
 * @returns {boolean}
 */
export const canDonateTo = (donation) => {
  return isDonationPending(donation);
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
 * Validate donation status transition
 * @param {string} currentStatus - Current status
 * @param {string} newStatus - New status
 * @returns {Object} - Validation result
 */
export const validateDonationStatusTransition = (currentStatus, newStatus) => {
  const errors = [];
  
  // Check if statuses are valid
  const validStatuses = Object.values(DONATION_STATUS);
  if (!validStatuses.includes(currentStatus)) {
    errors.push(`Invalid current status: ${currentStatus}`);
  }
  
  if (!validStatuses.includes(newStatus)) {
    errors.push(`Invalid new status: ${newStatus}`);
  }
  
  // Check if transition is allowed
  if (!canChangeDonationStatus(currentStatus, newStatus)) {
    errors.push(`Cannot change status from ${currentStatus} to ${newStatus}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Get next possible statuses for donation
 * @param {string} currentStatus - Current status
 * @returns {Array} - Array of possible next statuses
 */
export const getNextDonationStatuses = (currentStatus) => {
  const transitions = {
    [DONATION_STATUS.PENDING]: [
      { value: DONATION_STATUS.INPROGRESS, label: 'Mark as In Progress' },
      { value: DONATION_STATUS.CANCELED, label: 'Cancel Request' },
    ],
    [DONATION_STATUS.INPROGRESS]: [
      { value: DONATION_STATUS.DONE, label: 'Mark as Completed' },
      { value: DONATION_STATUS.CANCELED, label: 'Cancel Donation' },
    ],
    [DONATION_STATUS.DONE]: [],
    [DONATION_STATUS.CANCELED]: [],
  };
  
  return transitions[currentStatus] || [];
};

/**
 * Check if donation requires donor information
 * @param {Object} donation - Donation object
 * @returns {boolean}
 */
export const requiresDonorInfo = (donation) => {
  return isDonationInProgress(donation) || isDonationCompleted(donation);
};

/**
 * Check if donation shows action buttons
 * @param {Object} donation - Donation object
 * @returns {boolean}
 */
export const showsDonationActions = (donation) => {
  return isDonationPending(donation) || isDonationInProgress(donation);
};

/**
 * Get status badge configuration
 * @param {string} type - Status type (user/donation)
 * @param {string} status - Status value
 * @returns {Object} - Badge configuration
 */
export const getStatusBadgeConfig = (type, status) => {
  if (type === 'user') {
    return {
      label: getUserStatusLabel(status),
      color: getUserStatusColor(status),
      icon: getStatusIcon('user', status),
    };
  }
  
  if (type === 'donation') {
    return {
      label: getDonationStatusLabel(status),
      color: getDonationStatusColor(status),
      icon: getStatusIcon('donation', status),
    };
  }
  
  return {
    label: status || 'Unknown',
    color: 'bg-gray-100 text-gray-800',
    icon: 'help-circle',
  };
};

/**
 * Get status icon
 * @param {string} type - Status type (user/donation)
 * @param {string} status - Status value
 * @returns {string} - Icon name
 */
export const getStatusIcon = (type, status) => {
  const icons = {
    user: {
      [USER_STATUS.ACTIVE]: 'check-circle',
      [USER_STATUS.BLOCKED]: 'x-circle',
      [USER_STATUS.PENDING]: 'clock',
      [USER_STATUS.INACTIVE]: 'user-x',
    },
    donation: {
      [DONATION_STATUS.PENDING]: 'clock',
      [DONATION_STATUS.INPROGRESS]: 'refresh-cw',
      [DONATION_STATUS.DONE]: 'check-circle',
      [DONATION_STATUS.CANCELED]: 'x-circle',
    },
  };
  
  return icons[type]?.[status] || 'help-circle';
};

/**
 * Get status priority for sorting
 * @param {string} type - Status type (user/donation)
 * @param {string} status - Status value
 * @returns {number} - Priority number (lower = higher priority)
 */
export const getStatusPriority = (type, status) => {
  if (type === 'user') {
    const priorities = {
      [USER_STATUS.ACTIVE]: 1,
      [USER_STATUS.PENDING]: 2,
      [USER_STATUS.INACTIVE]: 3,
      [USER_STATUS.BLOCKED]: 4,
    };
    return priorities[status] || 5;
  }
  
  if (type === 'donation') {
    const priorities = {
      [DONATION_STATUS.PENDING]: 1,
      [DONATION_STATUS.INPROGRESS]: 2,
      [DONATION_STATUS.DONE]: 3,
      [DONATION_STATUS.CANCELED]: 4,
    };
    return priorities[status] || 5;
  }
  
  return 10;
};

/**
 * Sort by status priority
 * @param {Array} items - Array of items
 * @param {string} statusField - Status field name
 * @param {string} type - Status type
 * @returns {Array} - Sorted array
 */
export const sortByStatusPriority = (items, statusField = 'status', type = 'donation') => {
  return [...items].sort((a, b) => {
    const priorityA = getStatusPriority(type, a[statusField]);
    const priorityB = getStatusPriority(type, b[statusField]);
    return priorityA - priorityB;
  });
};

/**
 * Filter items by status
 * @param {Array} items - Array of items
 * @param {string} statusField - Status field name
 * @param {string|Array} statusFilter - Status filter(s)
 * @returns {Array} - Filtered array
 */
export const filterByStatus = (items, statusField = 'status', statusFilter) => {
  if (!statusFilter) return items;
  
  if (Array.isArray(statusFilter)) {
    return items.filter(item => statusFilter.includes(item[statusField]));
  }
  
  return items.filter(item => item[statusField] === statusFilter);
};

/**
 * Get status statistics
 * @param {Array} items - Array of items
 * @param {string} statusField - Status field name
 * @returns {Object} - Status counts
 */
export const getStatusStats = (items, statusField = 'status') => {
  const stats = {};
  
  items.forEach(item => {
    const status = item[statusField];
    stats[status] = (stats[status] || 0) + 1;
  });
  
  return stats;
};

/**
 * Get status distribution percentage
 * @param {Array} items - Array of items
 * @param {string} statusField - Status field name
 * @returns {Object} - Status percentages
 */
export const getStatusDistribution = (items, statusField = 'status') => {
  const stats = getStatusStats(items, statusField);
  const total = items.length;
  
  if (total === 0) return {};
  
  return Object.fromEntries(
    Object.entries(stats).map(([status, count]) => [
      status,
      Math.round((count / total) * 100)
    ])
  );
};

export default {
  // User Status
  getAllUserStatuses,
  getUserStatusLabel,
  getUserStatusColor,
  isUserActive,
  isUserBlocked,
  isUserPending,
  isUserInactive,
  canUserPerformActions,
  canUserCreateDonations,
  canUserDonate,
  validateUserStatusTransition,
  
  // Donation Status
  getAllDonationStatuses,
  getDonationStatusLabel,
  getDonationStatusColor,
  isDonationPending,
  isDonationInProgress,
  isDonationCompleted,
  isDonationCanceled,
  canEditDonation,
  canDeleteDonation,
  canDonateTo,
  canChangeDonationStatus,
  validateDonationStatusTransition,
  getNextDonationStatuses,
  requiresDonorInfo,
  showsDonationActions,
  
  // General Status
  getStatusBadgeConfig,
  getStatusIcon,
  getStatusPriority,
  sortByStatusPriority,
  filterByStatus,
  getStatusStats,
  getStatusDistribution,
};