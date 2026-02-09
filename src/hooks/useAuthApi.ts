import { useState } from 'react';
import api from '@/lib/api';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export const useAuthApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getErrorMessage = (err: any): string => {
    // Handle CORS errors
    if (err.name === 'CORSError' || (!err.response && err.message === 'Network Error')) {
      return 'Unable to connect to server. Please check if the backend is running and CORS is configured.';
    }

    // Handle CSRF errors
    if (err.name === 'CSRFError' || err.response?.status === 419) {
      return 'Session expired. Please refresh the page and try again.';
    }

    // Handle timeout errors
    if (err.code === 'ECONNABORTED') {
      return 'Request timeout. Please check your connection and try again.';
    }

    // Handle validation errors
    if (err.response?.status === 422) {
      const validationErrors = err.response?.data?.errors;
      if (validationErrors) {
        return Object.values(validationErrors).flat().join(', ');
      }
      return err.response?.data?.message || 'Validation failed';
    }

    // Handle authentication errors
    if (err.response?.status === 401) {
      return 'Authentication failed. Please check your credentials.';
    }

    // Handle forbidden errors
    if (err.response?.status === 403) {
      return 'You do not have permission to perform this action.';
    }

    // Handle not found errors
    if (err.response?.status === 404) {
      return 'Resource not found.';
    }

    // Handle server errors
    if (err.response?.status >= 500) {
      return 'Server error. Please try again later.';
    }

    // Default error message
    return err.response?.data?.message || err.message || 'An unexpected error occurred';
  };

  const request = async <T = any>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    data?: any,
    options?: UseApiOptions
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api[method](url, data);
      if (options?.onSuccess) {
        options.onSuccess(response.data);
      }
      return response.data;
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      
      if (options?.onError) {
        options.onError(err);
      }
      
      // Re-throw with user-friendly message
      const userError = new Error(errorMessage);
      userError.name = err.name || 'APIError';
      throw userError;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    loading,
    error,
    clearError,
    get: <T = any>(url: string, options?: UseApiOptions) => 
      request<T>('get', url, undefined, options),
    post: <T = any>(url: string, data?: any, options?: UseApiOptions) => 
      request<T>('post', url, data, options),
    put: <T = any>(url: string, data?: any, options?: UseApiOptions) => 
      request<T>('put', url, data, options),
    patch: <T = any>(url: string, data?: any, options?: UseApiOptions) => 
      request<T>('patch', url, data, options),
    delete: <T = any>(url: string, options?: UseApiOptions) => 
      request<T>('delete', url, undefined, options),
  };
};
