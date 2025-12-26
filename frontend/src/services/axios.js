import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../constants';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  config => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.warn('API Request:', config.method.toUpperCase(), config.url);
    }

    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  response => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.warn('API Response:', response.status, response.config.url);
    }

    return response;
  },
  error => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          toast.error('Unauthorized. Please login again.');
          // Clear auth token
          localStorage.removeItem('authToken');
          // Redirect to login page if needed
          // window.location.href = '/login';
          break;

        case 403:
          toast.error('Access forbidden.');
          break;

        case 404:
          toast.error('Resource not found.');
          break;

        case 500:
          toast.error('Server error. Please try again later.');
          break;

        default:
          toast.error(data?.message || 'An error occurred.');
      }
    } else if (error.request) {
      // Request made but no response received
      toast.error('Network error. Please check your connection.');
    } else {
      // Something else happened
      toast.error('An unexpected error occurred.');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
