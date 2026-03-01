import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const authService = {
  /**
   * Register a new user
   */
  register: async (name, email, password, confirmPassword) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password,
        confirmPassword,
      });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Registration failed' };
    }
  },

  /**
   * Login user
   */
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Login failed' };
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Get current user
   */
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Get auth token
   */
  getToken: () => {
    return localStorage.getItem('token');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Get user profile
   */
  getProfile: async () => {
    try {
      const token = authService.getToken();
      const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch profile' };
    }
  },
};

export default authService;
