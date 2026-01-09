import axios from './axios';

/**
 * API service layer
 * All API calls should go through this service
 */

// User API
export const userAPI = {
  // Register new user
  register: async (userData) => {
    const response = await axios.post('/auth/register/', {
      username: userData.username,
      email: userData.email,
      name: `${userData.firstName} ${userData.lastName}`.trim() || userData.username,
      first_name: userData.firstName,
      last_name: userData.lastName,
      password: userData.password,
      password_confirm: userData.confirmPassword,
    });
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await axios.post('/auth/login/', credentials);
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await axios.post('/auth/refresh/', {
      refresh: refreshToken,
    });
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await axios.get('/users/me/');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const formData = new FormData();

    // Add text fields
    if (userData.first_name) formData.append('first_name', userData.first_name);
    if (userData.last_name) formData.append('last_name', userData.last_name);
    if (userData.email) formData.append('email', userData.email);
    if (userData.name) formData.append('name', userData.name);

    // Add profile picture if it's a File object
    if (userData.profile_picture && userData.profile_picture instanceof File) {
      formData.append('profile_picture', userData.profile_picture);
    }

    const response = await axios.put('/users/profile/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await axios.post('/users/change-password/', {
      old_password: passwordData.oldPassword,
      new_password: passwordData.newPassword,
      confirm_password: passwordData.confirmPassword,
    });
    return response.data;
  },

  // Logout (client-side only, backend doesn't need logout endpoint)
  logout: async () => {
    // Clear tokens from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    return { message: 'Logged out successfully' };
  },
};

// Todo/Task API
export const todoAPI = {
  // Get all todos with optional filters
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.ordering) params.append('ordering', filters.ordering);
    if (filters.page) params.append('page', filters.page);

    const queryString = params.toString();
    const url = queryString ? `/todos/?${queryString}` : '/todos/';
    const response = await axios.get(url);
    return response.data;
  },

  // Get single todo
  getById: async (id) => {
    const response = await axios.get(`/todos/${id}/`);
    return response.data;
  },

  // Create todo
  create: async (todoData) => {
    const formData = new FormData();
    formData.append('title', todoData.title);
    formData.append('description', todoData.description);
    formData.append('priority', todoData.priority || 'Moderate');
    if (todoData.status) formData.append('status', todoData.status);
    if (todoData.due_date) formData.append('due_date', todoData.due_date);
    if (todoData.category) formData.append('category', todoData.category);
    if (todoData.image && todoData.image instanceof File) {
      formData.append('image', todoData.image);
    }

    const response = await axios.post('/todos/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update todo
  update: async (id, todoData) => {
    const formData = new FormData();
    if (todoData.title) formData.append('title', todoData.title);
    if (todoData.description) formData.append('description', todoData.description);
    if (todoData.priority) formData.append('priority', todoData.priority);
    if (todoData.status) formData.append('status', todoData.status);
    if (todoData.due_date) formData.append('due_date', todoData.due_date);
    if (todoData.category !== undefined) {
      formData.append('category', todoData.category || '');
    }
    if (todoData.image && todoData.image instanceof File) {
      formData.append('image', todoData.image);
    }

    const response = await axios.put(`/todos/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete todo
  delete: async (id) => {
    const response = await axios.delete(`/todos/${id}/`);
    return response.data;
  },

  // Get task statistics
  getStatistics: async () => {
    const response = await axios.get('/todos/statistics/');
    return response.data;
  },
};

// Category API
export const categoryAPI = {
  // Get all categories
  getAll: async () => {
    const response = await axios.get('/categories/');
    return response.data;
  },

  // Get single category
  getById: async (id) => {
    const response = await axios.get(`/categories/${id}/`);
    return response.data;
  },

  // Create category
  create: async (categoryData) => {
    const response = await axios.post('/categories/', {
      name: categoryData.name,
      color: categoryData.color || '#FF6767',
    });
    return response.data;
  },

  // Update category
  update: async (id, categoryData) => {
    const response = await axios.put(`/categories/${id}/`, {
      name: categoryData.name,
      color: categoryData.color,
    });
    return response.data;
  },

  // Delete category
  delete: async (id) => {
    const response = await axios.delete(`/categories/${id}/`);
    return response.data;
  },
};

// Billing API
export const billingAPI = {
  // Get all available products
  getProducts: async () => {
    const response = await axios.get('/billing/products/');
    return response.data;
  },

  // Get current user's subscriptions
  getMySubscriptions: async () => {
    const response = await axios.get('/billing/subscriptions/');
    return response.data;
  },

  // Check subscription status
  getSubscriptionStatus: async () => {
    const response = await axios.get('/billing/subscriptions/status/');
    return response.data;
  },

  // Create checkout session
  createCheckout: async (productId, priceId) => {
    const response = await axios.post('/billing/checkout/', {
      product_id: productId,
      price_id: priceId,
    });
    return response.data;
  },

  // Cancel subscription
  cancelSubscription: async (subscriptionId) => {
    const response = await axios.post(`/billing/subscriptions/${subscriptionId}/cancel/`);
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
