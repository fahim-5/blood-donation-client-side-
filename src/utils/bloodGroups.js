import { BLOOD_GROUPS, BLOOD_GROUP_LABELS, BLOOD_GROUP_COLORS } from './constants';

/**
 * Get all blood groups
 * @returns {Array} - Array of blood groups
 */
export const getAllBloodGroups = () => {
  return BLOOD_GROUPS;
};

/**
 * Get blood group options for select inputs
 * @returns {Array} - Array of blood group options
 */
export const getBloodGroupOptions = () => {
  return BLOOD_GROUPS.map(group => ({
    value: group,
    label: BLOOD_GROUP_LABELS[group],
  }));
};

/**
 * Get blood group label
 * @param {string} bloodGroup - Blood group code
 * @returns {string} - Blood group label
 */
export const getBloodGroupLabel = (bloodGroup) => {
  return BLOOD_GROUP_LABELS[bloodGroup] || bloodGroup || 'Unknown';
};

/**
 * Get blood group color classes
 * @param {string} bloodGroup - Blood group code
 * @returns {string} - Tailwind CSS color classes
 */
export const getBloodGroupColor = (bloodGroup) => {
  return BLOOD_GROUP_COLORS[bloodGroup] || 'bg-gray-100 text-gray-800';
};

/**
 * Check if blood groups are compatible for donation
 * @param {string} donorGroup - Donor's blood group
 * @param {string} recipientGroup - Recipient's blood group
 * @returns {boolean} - True if compatible
 */
export const areBloodGroupsCompatible = (donorGroup, recipientGroup) => {
  const compatibility = {
    'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], // Universal donor
    'O+': ['O+', 'A+', 'B+', 'AB+'],
    'A-': ['A-', 'A+', 'AB-', 'AB+'],
    'A+': ['A+', 'AB+'],
    'B-': ['B-', 'B+', 'AB-', 'AB+'],
    'B+': ['B+', 'AB+'],
    'AB-': ['AB-', 'AB+'],
    'AB+': ['AB+'], // Universal recipient
  };

  return compatibility[donorGroup]?.includes(recipientGroup) || false;
};

/**
 * Get compatible blood groups for a recipient
 * @param {string} recipientGroup - Recipient's blood group
 * @returns {Array} - Array of compatible donor blood groups
 */
export const getCompatibleDonorGroups = (recipientGroup) => {
  const donorGroups = {
    'O-': ['O-'],
    'O+': ['O-', 'O+'],
    'A-': ['O-', 'A-'],
    'A+': ['O-', 'O+', 'A-', 'A+'],
    'B-': ['O-', 'B-'],
    'B+': ['O-', 'O+', 'B-', 'B+'],
    'AB-': ['O-', 'A-', 'B-', 'AB-'],
    'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  };

  return donorGroups[recipientGroup] || [];
};

/**
 * Get blood group statistics
 * @param {Array} donors - Array of donor objects
 * @returns {Object} - Blood group distribution
 */
export const getBloodGroupStats = (donors) => {
  if (!Array.isArray(donors)) {
    return {};
  }

  const stats = BLOOD_GROUPS.reduce((acc, group) => {
    acc[group] = 0;
    return acc;
  }, {});

  donors.forEach(donor => {
    if (donor.bloodGroup && stats[donor.bloodGroup] !== undefined) {
      stats[donor.bloodGroup]++;
    }
  });

  return stats;
};

/**
 * Get blood group distribution as percentage
 * @param {Array} donors - Array of donor objects
 * @returns {Object} - Blood group distribution percentages
 */
export const getBloodGroupDistribution = (donors) => {
  const stats = getBloodGroupStats(donors);
  const total = Object.values(stats).reduce((sum, count) => sum + count, 0);

  if (total === 0) {
    return BLOOD_GROUPS.reduce((acc, group) => {
      acc[group] = 0;
      return acc;
    }, {});
  }

  return Object.fromEntries(
    Object.entries(stats).map(([group, count]) => [
      group,
      Math.round((count / total) * 100)
    ])
  );
};

/**
 * Get rare blood groups
 * @param {Array} donors - Array of donor objects
 * @param {number} threshold - Percentage threshold for rare groups
 * @returns {Array} - Rare blood groups
 */
export const getRareBloodGroups = (donors, threshold = 5) => {
  const distribution = getBloodGroupDistribution(donors);
  
  return Object.entries(distribution)
    .filter(([_, percentage]) => percentage <= threshold)
    .map(([group, _]) => group);
};

/**
 * Get most common blood groups
 * @param {Array} donors - Array of donor objects
 * @param {number} limit - Number of groups to return
 * @returns {Array} - Most common blood groups
 */
export const getMostCommonBloodGroups = (donors, limit = 3) => {
  const stats = getBloodGroupStats(donors);
  
  return Object.entries(stats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([group, _]) => group);
};

/**
 * Filter donors by blood group compatibility
 * @param {Array} donors - Array of donor objects
 * @param {string} recipientGroup - Recipient's blood group
 * @returns {Array} - Compatible donors
 */
export const filterCompatibleDonors = (donors, recipientGroup) => {
  if (!Array.isArray(donors) || !recipientGroup) {
    return [];
  }

  const compatibleGroups = getCompatibleDonorGroups(recipientGroup);
  
  return donors.filter(donor => 
    donor.bloodGroup && compatibleGroups.includes(donor.bloodGroup)
  );
};

/**
 * Get blood group emoji
 * @param {string} bloodGroup - Blood group code
 * @returns {string} - Emoji representation
 */
export const getBloodGroupEmoji = (bloodGroup) => {
  const emojis = {
    'A+': '🅰️➕',
    'A-': '🅰️➖',
    'B+': '🅱️➕',
    'B-': '🅱️➖',
    'AB+': '🆎➕',
    'AB-': '🆎➖',
    'O+': '🅾️➕',
    'O-': '🅾️➖',
  };

  return emojis[bloodGroup] || '🩸';
};

/**
 * Validate blood group
 * @param {string} bloodGroup - Blood group to validate
 * @returns {boolean} - True if valid
 */
export const isValidBloodGroup = (bloodGroup) => {
  return BLOOD_GROUPS.includes(bloodGroup);
};

/**
 * Get blood group description
 * @param {string} bloodGroup - Blood group code
 * @returns {Object} - Blood group information
 */
export const getBloodGroupInfo = (bloodGroup) => {
  const info = {
    'A+': {
      label: 'A Positive',
      description: 'Second most common blood type',
      population: '~34%',
      canDonateTo: ['A+', 'AB+'],
      canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
    },
    'A-': {
      label: 'A Negative',
      description: 'Relatively rare blood type',
      population: '~6%',
      canDonateTo: ['A+', 'A-', 'AB+', 'AB-'],
      canReceiveFrom: ['A-', 'O-'],
    },
    'B+': {
      label: 'B Positive',
      description: 'Third most common blood type',
      population: '~9%',
      canDonateTo: ['B+', 'AB+'],
      canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
    },
    'B-': {
      label: 'B Negative',
      description: 'Relatively rare blood type',
      population: '~2%',
      canDonateTo: ['B+', 'B-', 'AB+', 'AB-'],
      canReceiveFrom: ['B-', 'O-'],
    },
    'AB+': {
      label: 'AB Positive',
      description: 'Universal recipient, rarest blood type',
      population: '~3%',
      canDonateTo: ['AB+'],
      canReceiveFrom: ['All blood types'],
    },
    'AB-': {
      label: 'AB Negative',
      description: 'Very rare blood type',
      population: '~1%',
      canDonateTo: ['AB+', 'AB-'],
      canReceiveFrom: ['AB-', 'A-', 'B-', 'O-'],
    },
    'O+': {
      label: 'O Positive',
      description: 'Most common blood type',
      population: '~38%',
      canDonateTo: ['O+', 'A+', 'B+', 'AB+'],
      canReceiveFrom: ['O+', 'O-'],
    },
    'O-': {
      label: 'O Negative',
      description: 'Universal donor, relatively rare',
      population: '~7%',
      canDonateTo: ['All blood types'],
      canReceiveFrom: ['O-'],
    },
  };

  return info[bloodGroup] || {
    label: 'Unknown',
    description: 'Unknown blood type',
    population: 'Unknown',
    canDonateTo: [],
    canReceiveFrom: [],
  };
};

/**
 * Get blood group priority for emergencies
 * @param {string} bloodGroup - Blood group code
 * @returns {number} - Priority level (lower is higher priority)
 */
export const getBloodGroupPriority = (bloodGroup) => {
  const priorities = {
    'O-': 1, // Highest priority (universal donor)
    'O+': 2,
    'A-': 3,
    'B-': 4,
    'AB-': 5,
    'A+': 6,
    'B+': 7,
    'AB+': 8, // Lowest priority
  };

  return priorities[bloodGroup] || 9;
};

/**
 * Sort blood groups by priority
 * @param {Array} bloodGroups - Array of blood group codes
 * @returns {Array} - Sorted blood groups
 */
export const sortBloodGroupsByPriority = (bloodGroups) => {
  return [...bloodGroups].sort((a, b) => {
    const priorityA = getBloodGroupPriority(a);
    const priorityB = getBloodGroupPriority(b);
    return priorityA - priorityB;
  });
};

export default {
  getAllBloodGroups,
  getBloodGroupOptions,
  getBloodGroupLabel,
  getBloodGroupColor,
  areBloodGroupsCompatible,
  getCompatibleDonorGroups,
  getBloodGroupStats,
  getBloodGroupDistribution,
  getRareBloodGroups,
  getMostCommonBloodGroups,
  filterCompatibleDonors,
  getBloodGroupEmoji,
  isValidBloodGroup,
  getBloodGroupInfo,
  getBloodGroupPriority,
  sortBloodGroupsByPriority,
};