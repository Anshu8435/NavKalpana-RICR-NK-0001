import api from '../utils/api';

// Auth Services
export const authService = {
  async register(name, email, password) {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  async changePassword(currentPassword, newPassword) {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  async verifyEmail(token) {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  },

  async resendVerification(email) {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  },

  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token, newPassword) {
    const response = await api.post(`/auth/reset-password/${token}`, { password: newPassword });
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};

// Prediction Services
export const predictionService = {
  async createPrediction(patientData) {
    const response = await api.post('/predictions', patientData);
    return response.data;
  },

  async getUserReports(params = {}) {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', riskCategory } = params;
    let url = `/predictions/reports?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}`;
    if (riskCategory) {
      url += `&riskCategory=${encodeURIComponent(riskCategory)}`;
    }
    const response = await api.get(url);
    return response.data;
  },

  async getReportById(reportId) {
    const response = await api.get(`/predictions/reports/${reportId}`);
    return response.data;
  },

  async getUserStatistics() {
    const response = await api.get('/predictions/statistics');
    return response.data;
  },

  async deleteReport(reportId) {
    const response = await api.delete(`/predictions/reports/${reportId}`);
    return response.data;
  },

  async testMLService() {
    const response = await api.get('/predictions/health');
    return response.data;
  }
};

// Export combined services
const apiService = {
  auth: authService,
  predictions: predictionService,
};

export default apiService;
