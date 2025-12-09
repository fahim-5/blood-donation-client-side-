import { VALIDATION_MESSAGES } from './constants';

/**
 * Validator class with common validation rules
 */
class Validator {
  /**
   * Check if value is required
   * @param {any} value - Value to check
   * @returns {string|null} - Error message or null if valid
   */
  static required(value) {
    if (value === undefined || value === null || value === '') {
      return VALIDATION_MESSAGES.REQUIRED;
    }
    return null;
  }

  /**
   * Check if value is a valid email
   * @param {string} value - Email to validate
   * @returns {string|null} - Error message or null if valid
   */
  static email(value) {
    if (!value) return null;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return VALIDATION_MESSAGES.EMAIL;
    }
    return null;
  }

  /**
   * Check minimum length
   * @param {string} value - Value to check
   * @param {number} min - Minimum length
   * @returns {string|null} - Error message or null if valid
   */
  static minLength(value, min) {
    if (!value) return null;
    
    if (value.length < min) {
      return VALIDATION_MESSAGES.MIN_LENGTH.replace('{min}', min);
    }
    return null;
  }

  /**
   * Check maximum length
   * @param {string} value - Value to check
   * @param {number} max - Maximum length
   * @returns {string|null} - Error message or null if valid
   */
  static maxLength(value, max) {
    if (!value) return null;
    
    if (value.length > max) {
      return VALIDATION_MESSAGES.MAX_LENGTH.replace('{max}', max);
    }
    return null;
  }

  /**
   * Check if value is numeric
   * @param {any} value - Value to check
   * @returns {string|null} - Error message or null if valid
   */
  static numeric(value) {
    if (!value) return null;
    
    if (isNaN(Number(value))) {
      return 'Must be a number';
    }
    return null;
  }

  /**
   * Check minimum value
   * @param {number} value - Value to check
   * @param {number} min - Minimum value
   * @returns {string|null} - Error message or null if valid
   */
  static minValue(value, min) {
    if (value === undefined || value === null || value === '') return null;
    
    if (Number(value) < min) {
      return `Must be at least ${min}`;
    }
    return null;
  }

  /**
   * Check maximum value
   * @param {number} value - Value to check
   * @param {number} max - Maximum value
   * @returns {string|null} - Error message or null if valid
   */
  static maxValue(value, max) {
    if (value === undefined || value === null || value === '') return null;
    
    if (Number(value) > max) {
      return `Must be less than ${max}`;
    }
    return null;
  }

  /**
   * Check if passwords match
   * @param {string} password - Password
   * @param {string} confirmPassword - Confirm password
   * @returns {string|null} - Error message or null if valid
   */
  static passwordMatch(password, confirmPassword) {
    if (password !== confirmPassword) {
      return VALIDATION_MESSAGES.PASSWORD_MISMATCH;
    }
    return null;
  }

  /**
   * Check if value is a valid phone number
   * @param {string} value - Phone number to validate
   * @returns {string|null} - Error message or null if valid
   */
  static phone(value) {
    if (!value) return null;
    
    const phoneRegex = /^[0-9]{10,15}$/;
    const cleaned = value.replace(/[-\s]/g, '');
    
    if (!phoneRegex.test(cleaned)) {
      return VALIDATION_MESSAGES.INVALID_PHONE;
    }
    return null;
  }

  /**
   * Check if value is a valid URL
   * @param {string} value - URL to validate
   * @returns {string|null} - Error message or null if valid
   */
  static url(value) {
    if (!value) return null;
    
    try {
      new URL(value);
      return null;
    } catch (error) {
      return VALIDATION_MESSAGES.INVALID_URL;
    }
  }

  /**
   * Check if value is a valid date
   * @param {string} value - Date to validate
   * @returns {string|null} - Error message or null if valid
   */
  static date(value) {
    if (!value) return null;
    
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return 'Please enter a valid date';
    }
    return null;
  }

  /**
   * Check if date is in future
   * @param {string} value - Date to check
   * @returns {string|null} - Error message or null if valid
   */
  static futureDate(value) {
    const error = Validator.date(value);
    if (error) return error;
    
    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) {
      return 'Date must be in the future';
    }
    return null;
  }

  /**
   * Check if value is a valid password
   * @param {string} value - Password to validate
   * @returns {string|null} - Error message or null if valid
   */
  static password(value) {
    if (!value) return null;
    
    const errors = [];
    
    if (value.length < 6) {
      errors.push('at least 6 characters');
    }
    
    if (!/(?=.*[a-zA-Z])/.test(value)) {
      errors.push('contain letters');
    }
    
    if (!/(?=.*\d)/.test(value)) {
      errors.push('contain numbers');
    }
    
    if (errors.length > 0) {
      return `Password must ${errors.join(', ')}`;
    }
    
    return null;
  }

  /**
   * Validate registration form
   * @param {Object} data - Form data
   * @returns {Object} - Validation errors
   */
  static validateRegistration(data) {
    const errors = {};
    
    // Name
    errors.name = Validator.required(data.name);
    
    // Email
    errors.email = Validator.required(data.email) || Validator.email(data.email);
    
    // Password
    errors.password = Validator.required(data.password) || Validator.password(data.password);
    
    // Confirm Password
    errors.confirmPassword = Validator.required(data.confirmPassword) || 
      Validator.passwordMatch(data.password, data.confirmPassword);
    
    // Blood Group
    errors.bloodGroup = Validator.required(data.bloodGroup);
    
    // District
    errors.district = Validator.required(data.district);
    
    // Upazila
    errors.upazila = Validator.required(data.upazila);
    
    // Remove null errors
    return Object.fromEntries(
      Object.entries(errors).filter(([_, v]) => v !== null)
    );
  }

  /**
   * Validate login form
   * @param {Object} data - Form data
   * @returns {Object} - Validation errors
   */
  static validateLogin(data) {
    const errors = {};
    
    errors.email = Validator.required(data.email) || Validator.email(data.email);
    errors.password = Validator.required(data.password);
    
    return Object.fromEntries(
      Object.entries(errors).filter(([_, v]) => v !== null)
    );
  }

  /**
   * Validate donation request form
   * @param {Object} data - Form data
   * @returns {Object} - Validation errors
   */
  static validateDonationRequest(data) {
    const errors = {};
    
    // Recipient Information
    errors.recipientName = Validator.required(data.recipientName);
    errors.hospitalName = Validator.required(data.hospitalName);
    errors.fullAddress = Validator.required(data.fullAddress);
    
    // Location
    errors.recipientDistrict = Validator.required(data.recipientDistrict);
    errors.recipientUpazila = Validator.required(data.recipientUpazila);
    
    // Blood Group
    errors.bloodGroup = Validator.required(data.bloodGroup);
    
    // Date and Time
    errors.donationDate = Validator.required(data.donationDate) || 
      Validator.futureDate(data.donationDate);
    
    errors.donationTime = Validator.required(data.donationTime);
    
    // Request Message
    errors.requestMessage = Validator.required(data.requestMessage) || 
      Validator.minLength(data.requestMessage, 10);
    
    return Object.fromEntries(
      Object.entries(errors).filter(([_, v]) => v !== null)
    );
  }

  /**
   * Validate profile update form
   * @param {Object} data - Form data
   * @returns {Object} - Validation errors
   */
  static validateProfile(data) {
    const errors = {};
    
    errors.name = Validator.required(data.name);
    errors.bloodGroup = Validator.required(data.bloodGroup);
    errors.district = Validator.required(data.district);
    errors.upazila = Validator.required(data.upazila);
    
    if (data.phone) {
      errors.phone = Validator.phone(data.phone);
    }
    
    return Object.fromEntries(
      Object.entries(errors).filter(([_, v]) => v !== null)
    );
  }

  /**
   * Validate contact form
   * @param {Object} data - Form data
   * @returns {Object} - Validation errors
   */
  static validateContact(data) {
    const errors = {};
    
    errors.name = Validator.required(data.name);
    errors.email = Validator.required(data.email) || Validator.email(data.email);
    errors.subject = Validator.required(data.subject);
    errors.message = Validator.required(data.message) || 
      Validator.minLength(data.message, 10);
    
    return Object.fromEntries(
      Object.entries(errors).filter(([_, v]) => v !== null)
    );
  }

  /**
   * Validate change password form
   * @param {Object} data - Form data
   * @returns {Object} - Validation errors
   */
  static validateChangePassword(data) {
    const errors = {};
    
    errors.currentPassword = Validator.required(data.currentPassword);
    errors.newPassword = Validator.required(data.newPassword) || 
      Validator.password(data.newPassword);
    errors.confirmPassword = Validator.required(data.confirmPassword) || 
      Validator.passwordMatch(data.newPassword, data.confirmPassword);
    
    if (data.currentPassword === data.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }
    
    return Object.fromEntries(
      Object.entries(errors).filter(([_, v]) => v !== null)
    );
  }

  /**
   * Validate funding donation form
   * @param {Object} data - Form data
   * @returns {Object} - Validation errors
   */
  static validateFunding(data) {
    const errors = {};
    
    errors.amount = Validator.required(data.amount) || 
      Validator.numeric(data.amount) ||
      Validator.minValue(data.amount, 10) ||
      Validator.maxValue(data.amount, 1000000);
    
    if (data.message) {
      errors.message = Validator.maxLength(data.message, 500);
    }
    
    return Object.fromEntries(
      Object.entries(errors).filter(([_, v]) => v !== null)
    );
  }

  /**
   * Validate search form
   * @param {Object} data - Form data
   * @returns {Object} - Validation errors
   */
  static validateSearch(data) {
    const errors = {};
    
    if (!data.bloodGroup && !data.district && !data.upazila) {
      errors.general = 'Please select at least one search criteria';
    }
    
    return Object.fromEntries(
      Object.entries(errors).filter(([_, v]) => v !== null)
    );
  }

  /**
   * Create a custom validator
   * @param {Function} validationFn - Validation function
   * @param {string} errorMessage - Error message
   * @returns {Function} - Validator function
   */
  static createCustom(validationFn, errorMessage) {
    return (value) => {
      if (!validationFn(value)) {
        return errorMessage;
      }
      return null;
    };
  }

  /**
   * Validate multiple fields with same rule
   * @param {Object} data - Data object
   * @param {string[]} fields - Field names
   * @param {Function} validator - Validator function
   * @returns {Object} - Validation errors
   */
  static validateFields(data, fields, validator) {
    const errors = {};
    
    fields.forEach(field => {
      const error = validator(data[field]);
      if (error) {
        errors[field] = error;
      }
    });
    
    return errors;
  }

  /**
   * Check if validation has errors
   * @param {Object} errors - Validation errors object
   * @returns {boolean}
   */
  static hasErrors(errors) {
    return Object.keys(errors).length > 0;
  }
}

export default Validator;