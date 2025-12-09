import { useState, useCallback } from 'react';

const useFormValidation = (initialState = {}, validationRules = {}) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Common validation rules
  const defaultRules = {
    required: (value) => !value?.toString().trim() && 'This field is required',
    email: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return value && !emailRegex.test(value) && 'Please enter a valid email address';
    },
    minLength: (value, min) => 
      value && value.length < min && `Must be at least ${min} characters`,
    maxLength: (value, max) => 
      value && value.length > max && `Must be less than ${max} characters`,
    numeric: (value) => 
      value && isNaN(Number(value)) && 'Must be a number',
    minValue: (value, min) => 
      value && Number(value) < min && `Must be at least ${min}`,
    maxValue: (value, max) => 
      value && Number(value) > max && `Must be less than ${max}`,
    match: (value, fieldName, formData) => 
      value !== formData[fieldName] && 'Fields do not match',
    password: (value) => {
      if (!value) return false;
      if (value.length < 6) return 'Password must be at least 6 characters';
      if (!/(?=.*[a-zA-Z])/.test(value)) return 'Password must contain letters';
      if (!/(?=.*\d)/.test(value)) return 'Password must contain numbers';
      return false;
    },
    phone: (value) => {
      const phoneRegex = /^[0-9]{10,15}$/;
      return value && !phoneRegex.test(value.replace(/[-\s]/g, '')) && 'Please enter a valid phone number';
    },
    url: (value) => {
      const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      return value && !urlRegex.test(value) && 'Please enter a valid URL';
    }
  };

  const validateField = useCallback((name, value, rules = validationRules[name]) => {
    if (!rules) return '';
    
    const fieldRules = Array.isArray(rules) ? rules : [rules];
    
    for (const rule of fieldRules) {
      if (typeof rule === 'function') {
        const error = rule(value, formData);
        if (error) return error;
      } else if (typeof rule === 'string') {
        const error = defaultRules[rule]?.(value);
        if (error) return error;
      } else if (rule && typeof rule === 'object') {
        const [ruleName, param] = Object.entries(rule)[0];
        const error = defaultRules[ruleName]?.(value, param, formData);
        if (error) return error;
      }
    }
    
    return '';
  }, [formData, validationRules]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, validateField, validationRules]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;
    
    let newValue;
    if (type === 'checkbox') {
      newValue = checked;
    } else if (type === 'file') {
      newValue = files[0];
    } else {
      newValue = value;
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Validate field if it's been touched before
    if (touched[name]) {
      const error = validateField(name, newValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, [validateField]);

  const setFieldValue = useCallback((name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  }, [touched, validateField]);

  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, []);

  const resetForm = useCallback((newState = initialState) => {
    setFormData(newState);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialState]);

  const getFieldProps = useCallback((name) => ({
    name,
    value: formData[name] || '',
    onChange: handleChange,
    onBlur: handleBlur,
    error: errors[name],
    touched: touched[name]
  }), [formData, errors, touched, handleChange, handleBlur]);

  const isFieldValid = useCallback((fieldName) => {
    return !errors[fieldName] && touched[fieldName];
  }, [errors, touched]);

  const markAllAsTouched = useCallback(() => {
    const allTouched = {};
    Object.keys(validationRules).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
  }, [validationRules]);

  const handleSubmit = useCallback(async (submitFunction) => {
    setIsSubmitting(true);
    
    // Mark all fields as touched
    markAllAsTouched();
    
    // Validate entire form
    const isValid = validateForm();
    
    if (!isValid) {
      setIsSubmitting(false);
      return { success: false, errors };
    }
    
    try {
      const result = await submitFunction(formData);
      setIsSubmitting(false);
      return { success: true, data: result };
    } catch (error) {
      setIsSubmitting(false);
      
      // Handle server errors
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.message) {
        setErrors({ form: error.message });
      }
      
      return { success: false, error };
    }
  }, [formData, validateForm, errors, markAllAsTouched]);

  return {
    // State
    formData,
    errors,
    touched,
    isSubmitting,
    
    // Setters
    setFormData,
    setErrors,
    setTouched,
    setIsSubmitting,
    
    // Methods
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    resetForm,
    validateForm,
    validateField,
    
    // Helpers
    getFieldProps,
    isFieldValid,
    markAllAsTouched,
    handleSubmit,
    
    // Form status
    isValid: Object.keys(errors).length === 0,
    isDirty: Object.keys(touched).length > 0
  };
};

export default useFormValidation;