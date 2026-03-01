import axios from 'axios';
import authService from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = () => {
  const token = authService.getToken();
  return {
    Authorization: `Bearer ${token}`,
  };
};

const interviewService = {
  /**
   * Start a new interview session
   */
  startInterview: async (role, difficulty) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/interview/start`,
        { role, difficulty },
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to start interview',
      };
    }
  },

  /**
   * Submit answer for a question
   */
  submitAnswer: async (sessionId, questionIndex, userAnswer) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/interview/answer`,
        { sessionId, questionIndex, userAnswer },
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to submit answer',
      };
    }
  },

  /**
   * Get interview history
   */
  getHistory: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/interview/history`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to fetch interview history',
      };
    }
  },

  /**
   * Get detailed session information
   */
  getSessionDetail: async (sessionId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/interview/${sessionId}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to fetch session details',
      };
    }
  },

  /**
   * Get performance analytics
   */
  getAnalytics: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/interview/analytics/performance`,
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to fetch analytics',
      };
    }
  },
};

export default interviewService;
