/**
 * Date utility functions
 */

/**
 * Format date to specified format
 * @param {Date|string} date - Date to format
 * @param {string} format - Format string
 * @returns {string} - Formatted date
 */
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  if (!date) return '';
  
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Invalid Date';
  }
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  const formatMap = {
    'YYYY': year,
    'YY': String(year).slice(-2),
    'MM': month,
    'M': Number(month),
    'DD': day,
    'D': Number(day),
    'HH': hours,
    'H': Number(hours),
    'hh': String(d.getHours() % 12 || 12).padStart(2, '0'),
    'h': d.getHours() % 12 || 12,
    'mm': minutes,
    'm': Number(minutes),
    'ss': seconds,
    's': Number(seconds),
    'A': d.getHours() < 12 ? 'AM' : 'PM',
    'a': d.getHours() < 12 ? 'am' : 'pm',
  };
  
  return format.replace(
    /YYYY|YY|MM|M|DD|D|HH|H|hh|h|mm|m|ss|s|A|a/g,
    match => formatMap[match] || match
  );
};

/**
 * Get relative time from now
 * @param {Date|string} date - Date to compare
 * @returns {string} - Relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now - then) / 1000);
  
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
  
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
  
  const years = Math.floor(days / 365);
  return `${years} year${years > 1 ? 's' : ''} ago`;
};

/**
 * Check if date is today
 * @param {Date|string} date - Date to check
 * @returns {boolean}
 */
export const isToday = (date) => {
  if (!date) return false;
  
  const today = new Date();
  const checkDate = new Date(date);
  
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if date is yesterday
 * @param {Date|string} date - Date to check
 * @returns {boolean}
 */
export const isYesterday = (date) => {
  if (!date) return false;
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const checkDate = new Date(date);
  
  return (
    checkDate.getDate() === yesterday.getDate() &&
    checkDate.getMonth() === yesterday.getMonth() &&
    checkDate.getFullYear() === yesterday.getFullYear()
  );
};

/**
 * Check if date is in the past
 * @param {Date|string} date - Date to check
 * @returns {boolean}
 */
export const isPastDate = (date) => {
  if (!date) return false;
  
  const checkDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return checkDate < today;
};

/**
 * Check if date is in the future
 * @param {Date|string} date - Date to check
 * @returns {boolean}
 */
export const isFutureDate = (date) => {
  if (!date) return false;
  
  const checkDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return checkDate > today;
};

/**
 * Get start of day
 * @param {Date} date - Date object
 * @returns {Date} - Start of day
 */
export const getStartOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get end of day
 * @param {Date} date - Date object
 * @returns {Date} - End of day
 */
export const getEndOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Get start of week
 * @param {Date} date - Date object
 * @param {number} firstDayOfWeek - First day of week (0 = Sunday, 1 = Monday)
 * @returns {Date} - Start of week
 */
export const getStartOfWeek = (date, firstDayOfWeek = 0) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day < firstDayOfWeek ? 7 : 0) + day - firstDayOfWeek;
  
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get end of week
 * @param {Date} date - Date object
 * @param {number} firstDayOfWeek - First day of week (0 = Sunday, 1 = Monday)
 * @returns {Date} - End of week
 */
export const getEndOfWeek = (date, firstDayOfWeek = 0) => {
  const start = getStartOfWeek(date, firstDayOfWeek);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
};

/**
 * Get start of month
 * @param {Date} date - Date object
 * @returns {Date} - Start of month
 */
export const getStartOfMonth = (date) => {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get end of month
 * @param {Date} date - Date object
 * @returns {Date} - End of month
 */
export const getEndOfMonth = (date) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Get start of year
 * @param {Date} date - Date object
 * @returns {Date} - Start of year
 */
export const getStartOfYear = (date) => {
  const d = new Date(date);
  d.setMonth(0, 1);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get end of year
 * @param {Date} date - Date object
 * @returns {Date} - End of year
 */
export const getEndOfYear = (date) => {
  const d = new Date(date);
  d.setMonth(12, 0);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Add days to date
 * @param {Date} date - Start date
 * @param {number} days - Number of days to add
 * @returns {Date} - New date
 */
export const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

/**
 * Add months to date
 * @param {Date} date - Start date
 * @param {number} months - Number of months to add
 * @returns {Date} - New date
 */
export const addMonths = (date, months) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

/**
 * Add years to date
 * @param {Date} date - Start date
 * @param {number} years - Number of years to add
 * @returns {Date} - New date
 */
export const addYears = (date, years) => {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
};

/**
 * Get difference between two dates in days
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {number} - Difference in days
 */
export const getDaysDifference = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Get age from birth date
 * @param {Date|string} birthDate - Birth date
 * @returns {number} - Age in years
 */
export const getAge = (birthDate) => {
  if (!birthDate) return 0;
  
  const today = new Date();
  const birth = new Date(birthDate);
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Check if date is valid
 * @param {Date|string} date - Date to validate
 * @returns {boolean}
 */
export const isValidDate = (date) => {
  if (!date) return false;
  
  const d = new Date(date);
  return !isNaN(d.getTime());
};

/**
 * Parse date string with format
 * @param {string} dateString - Date string
 * @param {string} format - Date format
 * @returns {Date} - Parsed date
 */
export const parseDate = (dateString, format = 'YYYY-MM-DD') => {
  if (!dateString) return null;
  
  // Simple parser for common formats
  let year, month, day, hours, minutes, seconds;
  
  if (format === 'YYYY-MM-DD') {
    [year, month, day] = dateString.split('-').map(Number);
  } else if (format === 'DD/MM/YYYY') {
    [day, month, year] = dateString.split('/').map(Number);
  } else if (format === 'MM/DD/YYYY') {
    [month, day, year] = dateString.split('/').map(Number);
  } else {
    // Try to parse as ISO string
    return new Date(dateString);
  }
  
  // Adjust month (JavaScript months are 0-indexed)
  if (month) month -= 1;
  
  return new Date(year, month, day, hours || 0, minutes || 0, seconds || 0);
};

/**
 * Get month name
 * @param {number} month - Month number (0-11)
 * @param {string} format - Format (short/long)
 * @returns {string} - Month name
 */
export const getMonthName = (month, format = 'long') => {
  const date = new Date();
  date.setMonth(month);
  
  return date.toLocaleString('default', { month: format });
};

/**
 * Get day name
 * @param {number} day - Day number (0-6)
 * @param {string} format - Format (short/long)
 * @returns {string} - Day name
 */
export const getDayName = (day, format = 'long') => {
  const date = new Date();
  date.setDate(date.getDate() + (day - date.getDay()));
  
  return date.toLocaleString('default', { weekday: format });
};

/**
 * Get dates in range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Array<Date>} - Array of dates
 */
export const getDatesInRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);
  
  currentDate.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

/**
 * Format time duration
 * @param {number} seconds - Duration in seconds
 * @param {boolean} showSeconds - Whether to show seconds
 * @returns {string} - Formatted duration
 */
export const formatDuration = (seconds, showSeconds = true) => {
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
  
  if (showSeconds && secs > 0 || parts.length === 0) {
    parts.push(`${secs}s`);
  }
  
  return parts.join(' ');
};

/**
 * Get business days between dates
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {number} - Number of business days
 */
export const getBusinessDays = (startDate, endDate) => {
  let count = 0;
  const curDate = new Date(startDate);
  const end = new Date(endDate);
  
  while (curDate <= end) {
    const dayOfWeek = curDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday or Saturday
      count++;
    }
    curDate.setDate(curDate.getDate() + 1);
  }
  
  return count;
};

/**
 * Get quarter from date
 * @param {Date} date - Date object
 * @returns {number} - Quarter (1-4)
 */
export const getQuarter = (date) => {
  const month = date.getMonth();
  return Math.floor(month / 3) + 1;
};

/**
 * Get fiscal year
 * @param {Date} date - Date object
 * @param {number} startMonth - Fiscal year start month (0-11)
 * @returns {number} - Fiscal year
 */
export const getFiscalYear = (date, startMonth = 0) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth();
  
  return month < startMonth ? year : year + 1;
};

/**
 * Check if year is leap year
 * @param {number} year - Year to check
 * @returns {boolean}
 */
export const isLeapYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

/**
 * Get timezone offset string
 * @param {Date} date - Date object
 * @returns {string} - Timezone offset (e.g., "+06:00")
 */
export const getTimezoneOffset = (date) => {
  const offset = date.getTimezoneOffset();
  const sign = offset > 0 ? '-' : '+';
  const hours = Math.floor(Math.abs(offset) / 60).toString().padStart(2, '0');
  const minutes = (Math.abs(offset) % 60).toString().padStart(2, '0');
  
  return `${sign}${hours}:${minutes}`;
};

export default {
  formatDate,
  getRelativeTime,
  isToday,
  isYesterday,
  isPastDate,
  isFutureDate,
  getStartOfDay,
  getEndOfDay,
  getStartOfWeek,
  getEndOfWeek,
  getStartOfMonth,
  getEndOfMonth,
  getStartOfYear,
  getEndOfYear,
  addDays,
  addMonths,
  addYears,
  getDaysDifference,
  getAge,
  isValidDate,
  parseDate,
  getMonthName,
  getDayName,
  getDatesInRange,
  formatDuration,
  getBusinessDays,
  getQuarter,
  getFiscalYear,
  isLeapYear,
  getTimezoneOffset,
};