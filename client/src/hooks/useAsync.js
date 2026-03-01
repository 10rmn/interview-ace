import { useState, useCallback } from 'react';

/**
 * Custom hook for managing loading and error states
 */
const useAsync = (asyncFunction, immediate = true) => {
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await asyncFunction(...args);
      setData(response);
      return response;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [asyncFunction]);

  return { execute, loading, error, data };
};

export default useAsync;
