import { useState, useCallback, useMemo } from 'react';

const useFilter = (initialData = [], initialFilters = {}) => {
  const [data, setData] = useState(initialData);
  const [filters, setFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');

  // Apply filters to data
  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    let result = [...data];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => {
        return Object.values(item).some(value => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(query);
          }
          if (typeof value === 'number') {
            return value.toString().includes(query);
          }
          return false;
        });
      });
    }

    // Apply filters
    Object.entries(filters).forEach(([key, filterValue]) => {
      if (filterValue !== undefined && filterValue !== null && filterValue !== '') {
        if (Array.isArray(filterValue)) {
          result = result.filter(item => filterValue.includes(item[key]));
        } else if (typeof filterValue === 'function') {
          result = result.filter(item => filterValue(item[key], item));
        } else {
          result = result.filter(item => {
            const itemValue = item[key];
            if (typeof itemValue === 'string') {
              return itemValue.toLowerCase() === filterValue.toLowerCase();
            }
            return itemValue === filterValue;
          });
        }
      }
    });

    // Apply sorting
    if (sortBy) {
      result.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue);
          return sortOrder === 'asc' ? comparison : -comparison;
        }

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, filters, sortBy, sortOrder, searchQuery]);

  // Get unique values for a specific field
  const getUniqueValues = useCallback((fieldName) => {
    if (!Array.isArray(data) || !fieldName) return [];
    
    const values = data
      .map(item => item[fieldName])
      .filter(value => value !== undefined && value !== null);
    
    return [...new Set(values)].sort();
  }, [data]);

  // Get filter options for a field
  const getFilterOptions = useCallback((fieldName, transformFn) => {
    const uniqueValues = getUniqueValues(fieldName);
    
    if (transformFn && typeof transformFn === 'function') {
      return uniqueValues.map(value => ({
        value,
        label: transformFn(value)
      }));
    }
    
    return uniqueValues.map(value => ({
      value,
      label: typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : String(value)
    }));
  }, [getUniqueValues]);

  // Set a filter
  const setFilter = useCallback((fieldName, value) => {
    setFilters(prev => ({
      ...prev,
      [fieldName]: value
    }));
  }, []);

  // Remove a filter
  const removeFilter = useCallback((fieldName) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[fieldName];
      return newFilters;
    });
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
    setSearchQuery('');
    setSortBy('');
    setSortOrder('asc');
  }, [initialFilters]);

  // Toggle sort
  const toggleSort = useCallback((fieldName) => {
    if (sortBy === fieldName) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(fieldName);
      setSortOrder('asc');
    }
  }, [sortBy]);

  // Set sort
  const setSort = useCallback((fieldName, order = 'asc') => {
    setSortBy(fieldName);
    setSortOrder(order);
  }, []);

  // Update data
  const updateData = useCallback((newData) => {
    setData(newData);
  }, []);

  // Get active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    
    Object.values(filters).forEach(value => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          if (value.length > 0) count++;
        } else {
          count++;
        }
      }
    });
    
    if (searchQuery) count++;
    if (sortBy) count++;
    
    return count;
  }, [filters, searchQuery, sortBy]);

  // Get filter summary
  const getFilterSummary = useCallback(() => {
    const summary = {};
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        summary[key] = value;
      }
    });
    
    if (searchQuery) {
      summary.search = searchQuery;
    }
    
    if (sortBy) {
      summary.sort = { by: sortBy, order: sortOrder };
    }
    
    return summary;
  }, [filters, searchQuery, sortBy, sortOrder]);

  // Reset to initial state
  const reset = useCallback(() => {
    setData(initialData);
    setFilters(initialFilters);
    setSortBy('');
    setSortOrder('asc');
    setSearchQuery('');
  }, [initialData, initialFilters]);

  // Group data by field
  const groupBy = useCallback((fieldName) => {
    if (!Array.isArray(filteredData) || !fieldName) return {};
    
    return filteredData.reduce((groups, item) => {
      const key = item[fieldName];
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
  }, [filteredData]);

  // Get statistics
  const getStats = useCallback(() => {
    return {
      total: data.length,
      filtered: filteredData.length,
      activeFilters: activeFiltersCount,
      sort: sortBy ? { field: sortBy, order: sortOrder } : null
    };
  }, [data.length, filteredData.length, activeFiltersCount, sortBy, sortOrder]);

  return {
    // State
    data,
    filteredData,
    filters,
    sortBy,
    sortOrder,
    searchQuery,
    
    // Setters
    setData: updateData,
    setFilters,
    setFilter,
    removeFilter,
    clearFilters,
    setSortBy: setSort,
    toggleSort,
    setSearchQuery,
    
    // Getters
    getUniqueValues,
    getFilterOptions,
    getFilterSummary,
    getStats,
    
    // Methods
    groupBy,
    reset,
    
    // Derived values
    activeFiltersCount,
    hasFilters: activeFiltersCount > 0,
    hasSearch: !!searchQuery,
    hasSort: !!sortBy,
    isEmpty: filteredData.length === 0
  };
};

export default useFilter;