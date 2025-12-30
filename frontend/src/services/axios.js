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
      console.log('API Request:', config.method.toUpperCase(), config.url);
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
      console.log('API Response:', response.status, response.config.url);
    }

    return response;
  },
  async error => {
    const originalRequest = error.config;

    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      // Handle token refresh on 401
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            // Try to refresh the token
            const response = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'}/auth/refresh`,
              { refresh: refreshToken }
            );

            const { access } = response.data;
            localStorage.setItem('authToken', access);

            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${access}`;
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, logout user
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          toast.error('Session expired. Please login again.');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      switch (status) {
        case 401:
          if (!originalRequest._retry) {
            toast.error('Unauthorized. Please login again.');
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
          }
          break;

        case 403:
          toast.error('Access forbidden.');
          break;

        case 404:
          // Don't show toast for 404, let components handle it
          break;

        case 500:
          toast.error('Server error. Please try again later.');
          break;

        default:
          // Show validation errors or custom messages
          const errorMessage = data?.message || data?.detail || 'An error occurred.';
          if (typeof errorMessage === 'string') {
            toast.error(errorMessage);
          } else if (typeof errorMessage === 'object') {
            // Handle field-specific errors
            const firstError = Object.values(errorMessage)[0];
            toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
          }
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
