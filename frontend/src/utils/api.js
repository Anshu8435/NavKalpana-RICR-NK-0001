import axios from 'axios';

const isProductionDomain =
  typeof window !== 'undefined' &&
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1';

const resolveApiBase = () => {
  let url = import.meta.env.VITE_API_URL;
  if (url && typeof url === 'string' && url.trim() !== '') {
    url = url.trim().replace(/\/+$/, '');
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }
    if (!url.endsWith('/api')) {
      url = `${url}/api`;
    }
    return url;
  }
  return isProductionDomain
    ? 'https://cardioshield-backend.onrender.com/api'
    : 'http://localhost:5000/api';
};

const API_BASE = resolveApiBase();

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
