import axios from './axios';

/**
 * API service layer
 * All API calls should go through this service
 */

// Example: User API
export const userAPI = {
  // Get current user
  getCurrentUser: async () => {
    const response = await axios.get('/users/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async userData => {
    const response = await axios.put('/users/profile', userData);
    return response.data;
  },

  // Login
  login: async credentials => {
    const response = await axios.post('/auth/login', credentials);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await axios.post('/auth/logout');
    return response.data;
  },
};

// Example: Todo API
export const todoAPI = {
  // Get all todos
  getAll: async () => {
    const response = await axios.get('/todos');
    return response.data;
  },

  // Get single todo
  getById: async id => {
    const response = await axios.get(`/todos/${id}`);
    return response.data;
  },

  // Create todo
  create: async todoData => {
    const response = await axios.post('/todos', todoData);
    return response.data;
  },

  // Update todo
  update: async (id, todoData) => {
    const response = await axios.put(`/todos/${id}`, todoData);
    return response.data;
  },

  // Delete todo
  delete: async id => {
    const response = await axios.delete(`/todos/${id}`);
    return response.data;
  },
};

// Generic API helper functions
export const api = {
  get: (url, config) => axios.get(url, config),
  post: (url, data, config) => axios.post(url, data, config),
  put: (url, data, config) => axios.put(url, data, config),
  patch: (url, data, config) => axios.patch(url, data, config),
  delete: (url, config) => axios.delete(url, config),
};
