import { USER_ROLES, ROLE_LABELS, ROLE_COLORS } from './constants';

/**
 * Role Utility Functions
 * Handles role-based permissions and validations
 */

/**
 * Get all available roles
 * @returns {Array} - Array of role objects
 */
export const getAllRoles = () => {
  return Object.values(USER_ROLES).map(role => ({
    value: role,
    label: ROLE_LABELS[role],
    color: ROLE_COLORS[role],
  }));
};

/**
 * Get role label
 * @param {string} role - Role value
 * @returns {string} - Role label
 */
export const getRoleLabel = (role) => {
  return ROLE_LABELS[role] || role || 'Unknown';
};

/**
 * Get role color classes
 * @param {string} role - Role value
 * @returns {string} - Tailwind CSS classes
 */
export const getRoleColor = (role) => {
  return ROLE_COLORS[role] || 'bg-gray-100 text-gray-800';
};

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
 * @param {Array} roles - Array of roles
 * @returns {boolean}
 */
export const hasAnyRole = (user, roles) => {
  if (!user?.role) return false;
  return roles.includes(user.role);
};

/**
 * Check if user has all of the specified roles
 * @param {Object} user - User object
 * @param {Array} roles - Array of roles
 * @returns {boolean}
 */
export const hasAllRoles = (user, roles) => {
  if (!user?.role) return false;
  return roles.every(role => user.role === role);
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
 * Check if user can manage users
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const canManageUsers = (user) => {
  return isAdmin(user);
};

/**
 * Check if user can manage donation requests
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const canManageDonations = (user) => {
  return isAdmin(user) || isVolunteer(user);
};

/**
 * Check if user can create donation requests
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const canCreateDonations = (user) => {
  return isDonor(user) || isAdmin(user) || isVolunteer(user);
};

/**
 * Check if user can edit donation request
 * @param {Object} user - User object
 * @param {Object} donation - Donation object
 * @returns {boolean}
 */
export const canEditDonation = (user, donation) => {
  if (!user || !donation) return false;
  
  if (isAdmin(user)) return true;
  
  if (isVolunteer(user)) {
    // Volunteers can only update status
    return true;
  }
  
  if (isDonor(user)) {
    // Donors can edit their own pending donations
    return donation.requester?._id === user._id && donation.status === 'pending';
  }
  
  return false;
};

/**
 * Check if user can delete donation request
 * @param {Object} user - User object
 * @param {Object} donation - Donation object
 * @returns {boolean}
 */
export const canDeleteDonation = (user, donation) => {
  if (!user || !donation) return false;
  
  if (isAdmin(user)) return true;
  
  if (isDonor(user)) {
    // Donors can delete their own pending donations
    return donation.requester?._id === user._id && donation.status === 'pending';
  }
  
  return false;
};

/**
 * Check if user can update donation status
 * @param {Object} user - User object
 * @param {Object} donation - Donation object
 * @returns {boolean}
 */
export const canUpdateDonationStatus = (user, donation) => {
  if (!user || !donation) return false;
  
  if (isAdmin(user)) return true;
  
  if (isVolunteer(user)) {
    // Volunteers can update status of any donation
    return true;
  }
  
  if (isDonor(user)) {
    // Donors can update status of their own in-progress donations
    return donation.requester?._id === user._id && donation.status === 'inprogress';
  }
  
  return false;
};

/**
 * Check if user can donate to a request
 * @param {Object} user - User object
 * @param {Object} donation - Donation object
 * @returns {boolean}
 */
export const canDonateToRequest = (user, donation) => {
  if (!user || !donation) return false;
  
  // User must be active donor
  if (!isDonor(user) || user.status !== 'active') {
    return false;
  }
  
  // Donation must be pending
  if (donation.status !== 'pending') {
    return false;
  }
  
  // User cannot donate to their own request
  if (donation.requester?._id === user._id) {
    return false;
  }
  
  return true;
};

/**
 * Check if user can view user details
 * @param {Object} currentUser - Current user object
 * @param {Object} targetUser - Target user object
 * @returns {boolean}
 */
export const canViewUserDetails = (currentUser, targetUser) => {
  if (!currentUser || !targetUser) return false;
  
  // Users can view their own details
  if (currentUser._id === targetUser._id) {
    return true;
  }
  
  // Admins can view all user details
  if (isAdmin(currentUser)) {
    return true;
  }
  
  // Volunteers can view limited donor details
  if (isVolunteer(currentUser) && isDonor(targetUser)) {
    return true;
  }
  
  return false;
};

/**
 * Check if user can edit user profile
 * @param {Object} currentUser - Current user object
 * @param {Object} targetUser - Target user object
 * @returns {boolean}
 */
export const canEditUserProfile = (currentUser, targetUser) => {
  if (!currentUser || !targetUser) return false;
  
  // Users can edit their own profile
  if (currentUser._id === targetUser._id) {
    return true;
  }
  
  // Admins can edit any user profile
  if (isAdmin(currentUser)) {
    return true;
  }
  
  return false;
};

/**
 * Check if user can change user role
 * @param {Object} currentUser - Current user object
 * @param {string} newRole - New role to assign
 * @returns {boolean}
 */
export const canChangeUserRole = (currentUser, newRole) => {
  if (!currentUser) return false;
  
  // Only admins can change roles
  if (!isAdmin(currentUser)) {
    return false;
  }
  
  // Validate new role
  const validRoles = Object.values(USER_ROLES);
  return validRoles.includes(newRole);
};

/**
 * Check if user can block/unblock users
 * @param {Object} currentUser - Current user object
 * @returns {boolean}
 */
export const canManageUserStatus = (currentUser) => {
  return isAdmin(currentUser);
};

/**
 * Check if user can view dashboard
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const canViewDashboard = (user) => {
  if (!user) return false;
  
  return isAdmin(user) || isDonor(user) || isVolunteer(user);
};

/**
 * Check if user can view admin dashboard
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const canViewAdminDashboard = (user) => {
  return isAdmin(user);
};

/**
 * Check if user can view donor dashboard
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const canViewDonorDashboard = (user) => {
  return isDonor(user);
};

/**
 * Check if user can view volunteer dashboard
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const canViewVolunteerDashboard = (user) => {
  return isVolunteer(user);
};

/**
 * Check if user can access funding features
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const canAccessFunding = (user) => {
  if (!user) return false;
  
  // All authenticated users can access funding
  return isAdmin(user) || isDonor(user) || isVolunteer(user);
};

/**
 * Check if user can create funding campaigns
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const canCreateFunding = (user) => {
  return isAdmin(user);
};

/**
 * Check if user can manage funding campaigns
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const canManageFunding = (user) => {
  return isAdmin(user);
};

/**
 * Check if user can donate to funding
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const canDonateToFunding = (user) => {
  if (!user) return false;
  
  // All authenticated users can donate
  return isAdmin(user) || isDonor(user) || isVolunteer(user);
};

/**
 * Check if user can view analytics
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const canViewAnalytics = (user) => {
  return isAdmin(user);
};

/**
 * Check if user can export data
 * @param {Object} user - User object
 * @param {string} dataType - Type of data to export
 * @returns {boolean}
 */
export const canExportData = (user, dataType) => {
  if (!user) return false;
  
  if (isAdmin(user)) {
    // Admins can export all data
    return true;
  }
  
  if (isVolunteer(user)) {
    // Volunteers can export donor and donation data
    return ['donors', 'donations'].includes(dataType);
  }
  
  if (isDonor(user)) {
    // Donors can export their own data
    return ['my-donations', 'my-profile'].includes(dataType);
  }
  
  return false;
};

/**
 * Get dashboard routes based on user role
 * @param {Object} user - User object
 * @returns {Array} - Array of allowed dashboard routes
 */
export const getAllowedDashboardRoutes = (user) => {
  if (!user) return [];
  
  const baseRoutes = [
    { path: '/dashboard', label: 'Dashboard', icon: 'home' },
    { path: '/dashboard/profile', label: 'Profile', icon: 'user' },
    { path: '/dashboard/change-password', label: 'Change Password', icon: 'lock' },
    { path: '/dashboard/notification-settings', label: 'Notifications', icon: 'bell' },
  ];
  
  if (isAdmin(user)) {
    return [
      ...baseRoutes,
      { path: '/dashboard/all-users', label: 'All Users', icon: 'users' },
      { path: '/dashboard/all-blood-donation-request', label: 'All Donations', icon: 'droplet' },
      { path: '/dashboard/funding', label: 'Funding', icon: 'dollar-sign' },
      { path: '/dashboard/admin/settings', label: 'Settings', icon: 'settings' },
    ];
  }
  
  if (isVolunteer(user)) {
    return [
      ...baseRoutes,
      { path: '/dashboard/all-blood-donation-request', label: 'All Donations', icon: 'droplet' },
      { path: '/dashboard/funding', label: 'Funding', icon: 'dollar-sign' },
      { path: '/dashboard/volunteer/tasks', label: 'Tasks', icon: 'clipboard' },
    ];
  }
  
  if (isDonor(user)) {
    return [
      ...baseRoutes,
      { path: '/dashboard/my-donation-requests', label: 'My Donations', icon: 'droplet' },
      { path: '/dashboard/create-donation-request', label: 'Create Request', icon: 'plus-circle' },
      { path: '/dashboard/funding', label: 'Funding', icon: 'dollar-sign' },
    ];
  }
  
  return baseRoutes;
};

/**
 * Get permissions object for user
 * @param {Object} user - User object
 * @returns {Object} - Permissions object
 */
export const getUserPermissions = (user) => {
  return {
    // Role checks
    isAdmin: isAdmin(user),
    isDonor: isDonor(user),
    isVolunteer: isVolunteer(user),
    
    // Dashboard access
    canViewDashboard: canViewDashboard(user),
    canViewAdminDashboard: canViewAdminDashboard(user),
    canViewDonorDashboard: canViewDonorDashboard(user),
    canViewVolunteerDashboard: canViewVolunteerDashboard(user),
    
    // User management
    canManageUsers: canManageUsers(user),
    canChangeUserRole: canChangeUserRole(user, 'donor'), // Check with dummy role
    canManageUserStatus: canManageUserStatus(user),
    
    // Donation management
    canManageDonations: canManageDonations(user),
    canCreateDonations: canCreateDonations(user),
    
    // Funding access
    canAccessFunding: canAccessFunding(user),
    canCreateFunding: canCreateFunding(user),
    canManageFunding: canManageFunding(user),
    canDonateToFunding: canDonateToFunding(user),
    
    // Analytics
    canViewAnalytics: canViewAnalytics(user),
    
    // Data export
    canExportUsers: canExportData(user, 'users'),
    canExportDonors: canExportData(user, 'donors'),
    canExportDonations: canExportData(user, 'donations'),
    canExportMyData: canExportData(user, 'my-donations'),
    
    // Routes
    allowedDashboardRoutes: getAllowedDashboardRoutes(user),
  };
};

/**
 * Validate role transition
 * @param {string} currentRole - Current role
 * @param {string} newRole - New role
 * @returns {Object} - Validation result
 */
export const validateRoleTransition = (currentRole, newRole) => {
  const errors = [];
  
  // Check if roles are valid
  const validRoles = Object.values(USER_ROLES);
  if (!validRoles.includes(currentRole)) {
    errors.push(`Invalid current role: ${currentRole}`);
  }
  
  if (!validRoles.includes(newRole)) {
    errors.push(`Invalid new role: ${newRole}`);
  }
  
  // Check if transition is allowed
  if (currentRole === newRole) {
    errors.push('New role must be different from current role');
  }
  
  // Special rules for admin role
  if (newRole === USER_ROLES.ADMIN) {
    // Only admins can assign admin role (checked elsewhere)
    // No technical restrictions here
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Get role hierarchy level
 * @param {string} role - Role value
 * @returns {number} - Hierarchy level (higher = more permissions)
 */
export const getRoleHierarchy = (role) => {
  const hierarchy = {
    [USER_ROLES.ADMIN]: 3,
    [USER_ROLES.VOLUNTEER]: 2,
    [USER_ROLES.DONOR]: 1,
  };
  
  return hierarchy[role] || 0;
};

/**
 * Check if user has higher or equal role hierarchy
 * @param {Object} user - User object
 * @param {string} targetRole - Target role to compare
 * @returns {boolean}
 */
export const hasHigherOrEqualRole = (user, targetRole) => {
  const userHierarchy = getRoleHierarchy(user?.role);
  const targetHierarchy = getRoleHierarchy(targetRole);
  
  return userHierarchy >= targetHierarchy;
};

export default {
  getAllRoles,
  getRoleLabel,
  getRoleColor,
  hasRole,
  hasAnyRole,
  hasAllRoles,
  isAdmin,
  isDonor,
  isVolunteer,
  canManageUsers,
  canManageDonations,
  canCreateDonations,
  canEditDonation,
  canDeleteDonation,
  canUpdateDonationStatus,
  canDonateToRequest,
  canViewUserDetails,
  canEditUserProfile,
  canChangeUserRole,
  canManageUserStatus,
  canViewDashboard,
  canViewAdminDashboard,
  canViewDonorDashboard,
  canViewVolunteerDashboard,
  canAccessFunding,
  canCreateFunding,
  canManageFunding,
  canDonateToFunding,
  canViewAnalytics,
  canExportData,
  getAllowedDashboardRoutes,
  getUserPermissions,
  validateRoleTransition,
  getRoleHierarchy,
  hasHigherOrEqualRole,
};