import { useState, useMemo, useCallback } from 'react';

const usePagination = (initialState = {}) => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    ...initialState
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { page, limit, total, totalPages } = pagination;

  const startIndex = useMemo(() => (page - 1) * limit, [page, limit]);
  const endIndex = useMemo(() => Math.min(startIndex + limit, total), [startIndex, limit, total]);

  const hasNextPage = useMemo(() => page < totalPages, [page, totalPages]);
  const hasPrevPage = useMemo(() => page > 1, [page]);
  const isFirstPage = useMemo(() => page === 1, [page]);
  const isLastPage = useMemo(() => page === totalPages, [page, totalPages]);

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, page - 2);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (startPage > 1) {
        if (startPage > 2) {
          pages.unshift('...');
        }
        pages.unshift(1);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  }, [page, totalPages]);

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
      return prev.page + 1;
    }
    return page;
  }, [hasNextPage, page]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
      return prev.page - 1;
    }
    return page;
  }, [hasPrevPage, page]);

  const goToPage = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPagination(prev => ({ ...prev, page: newPage }));
      return newPage;
    }
    return page;
  }, [page, totalPages]);

  const changeLimit = useCallback((newLimit) => {
    setPagination(prev => ({ 
      ...prev, 
      limit: newLimit,
      page: 1 
    }));
    return newLimit;
  }, []);

  const updatePagination = useCallback((newPagination) => {
    setPagination(prev => ({
      ...prev,
      ...newPagination
    }));
  }, []);

  const updateData = useCallback((newData) => {
    setData(newData);
  }, []);

  const getPageData = useCallback(() => {
    if (!Array.isArray(data)) return [];
    return data.slice(startIndex, endIndex);
  }, [data, startIndex, endIndex]);

  const resetPagination = useCallback(() => {
    setPagination({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    });
    setData([]);
  }, []);

  const calculatePagination = useCallback((totalItems, itemsPerPage = limit) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentPage = Math.min(page, totalPages || 1);
    
    setPagination(prev => ({
      ...prev,
      total: totalItems,
      totalPages,
      page: currentPage,
      limit: itemsPerPage
    }));
    
    return {
      page: currentPage,
      limit: itemsPerPage,
      total: totalItems,
      totalPages
    };
  }, [page, limit]);

  return {
    // State
    pagination,
    data,
    loading,
    
    // Getters
    page,
    limit,
    total,
    totalPages,
    startIndex,
    endIndex,
    hasNextPage,
    hasPrevPage,
    isFirstPage,
    isLastPage,
    pageNumbers,
    
    // Data methods
    getPageData,
    updateData,
    
    // Pagination methods
    nextPage,
    prevPage,
    goToPage,
    changeLimit,
    updatePagination,
    resetPagination,
    calculatePagination,
    
    // Loading
    setLoading
  };
};

export default usePagination;