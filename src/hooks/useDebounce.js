import { useState, useEffect, useRef } from 'react';

const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timerRef = useRef();

  useEffect(() => {
    // Clear the previous timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set a new timer
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay]);

  // Function to manually trigger debounced value
  const flush = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setDebouncedValue(value);
  };

  // Function to cancel the debounce
  const cancel = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  return {
    debouncedValue,
    flush,
    cancel,
    isPending: debouncedValue !== value
  };
};

// Hook for debouncing a callback function
export const useDebouncedCallback = (callback, delay = 500, dependencies = []) => {
  const timerRef = useRef();

  const debouncedCallback = (...args) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, dependencies);

  // Function to immediately call the callback
  const flush = (...args) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    callback(...args);
  };

  // Function to cancel the debounced call
  const cancel = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  return {
    debouncedCallback,
    flush,
    cancel
  };
};

// Hook for debouncing async functions
export const useDebouncedAsync = (asyncFunction, delay = 500) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const timerRef = useRef();
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const execute = async (...args) => {
    return new Promise((resolve, reject) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(async () => {
        try {
          if (mountedRef.current) {
            setIsLoading(true);
            setError(null);
          }
          
          const result = await asyncFunction(...args);
          
          if (mountedRef.current) {
            setData(result);
            setIsLoading(false);
            resolve(result);
          }
        } catch (err) {
          if (mountedRef.current) {
            setError(err);
            setIsLoading(false);
            reject(err);
          }
        }
      }, delay);
    });
  };

  const executeImmediately = async (...args) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const result = await asyncFunction(...args);
      
      setData(result);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err);
      setIsLoading(false);
      throw err;
    }
  };

  const cancel = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (mountedRef.current) {
      setIsLoading(false);
    }
  };

  const reset = () => {
    cancel();
    if (mountedRef.current) {
      setData(null);
      setError(null);
      setIsLoading(false);
    }
  };

  return {
    execute,
    executeImmediately,
    cancel,
    reset,
    isLoading,
    error,
    data,
    isIdle: !isLoading && !data && !error,
    hasError: !!error,
    hasData: !!data
  };
};

export default useDebounce;