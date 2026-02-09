import axios, { AxiosError } from 'axios';
import { getAuthToken, getCookie } from './cookies';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for Sanctum to work with cookies
  timeout: 30000, // 30 second timeout
});

// Request interceptor to add Bearer token and CSRF token
api.interceptors.request.use(
  async (config) => {
    // Add Bearer token from cookie if it exists
    const authToken = getAuthToken();
    if (authToken) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }

    // Get CSRF token from cookie if it exists (for Sanctum compatibility)
    const csrfToken = getCookie('XSRF-TOKEN');
    if (csrfToken) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(csrfToken);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle CORS errors
    if (!error.response && error.message === 'Network Error') {
      const corsError = new Error(
        'Unable to connect to the server. Please check:\n' +
        '1. Your Laravel backend is running\n' +
        '2. CORS is properly configured in Laravel\n' +
        `3. Backend URL is correct: ${API_URL}`
      );
      corsError.name = 'CORSError';
      return Promise.reject(corsError);
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        window.location.href = '/login';
      }
    }

    // Handle 419 CSRF Token Mismatch
    if (error.response?.status === 419) {
      const csrfError = new Error(
        'Session expired. Please refresh the page and try again.'
      );
      csrfError.name = 'CSRFError';
      return Promise.reject(csrfError);
    }

    return Promise.reject(error);
  }
);


// Initialize CSRF token (call this before making authenticated requests)
export const initCsrfToken = async (retries = 3): Promise<void> => {
  for (let i = 0; i < retries; i++) {
    try {
      await axios.get(`${API_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
        timeout: 10000,
      });
      return; // Success, exit function
    } catch (error: any) {
      console.warn(`CSRF token initialization attempt ${i + 1} failed:`, error.message);
      
      // If it's the last retry, throw a helpful error
      if (i === retries - 1) {
        if (!error.response && error.message === 'Network Error') {
          const corsError = new Error(
            'Cannot connect to backend server. Please ensure:\n' +
            `1. Laravel backend is running at ${API_URL}\n` +
            '2. CORS is configured to allow requests from this domain\n' +
            '3. Check browser console for detailed CORS errors'
          );
          corsError.name = 'CORSError';
          throw corsError;
        }
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
};

// Health check function
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    await axios.get(`${API_URL}/api/health`, {
      timeout: 5000,
    });
    return true;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

export default api;
