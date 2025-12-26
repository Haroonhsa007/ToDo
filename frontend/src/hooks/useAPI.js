import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * Custom hook for handling API calls with loading and error states
 * @returns {Object} - { loading, error, execute }
 */
export function useAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiFunction, successMessage = null) => {
    try {
      setLoading(true);
      setError(null);

      const result = await apiFunction();

      if (successMessage) {
        toast.success(successMessage);
      }

      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      // Error toast is already handled by axios interceptor
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return { loading, error, execute, reset };
}
