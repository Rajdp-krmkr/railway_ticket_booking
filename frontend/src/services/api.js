import axios from 'axios';

// Create custom Axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('railway_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authorization expiration errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('[API] Token expired or invalid, cleaning up authentication state');
      localStorage.removeItem('railway_token');
      localStorage.removeItem('railway_user');
      // Optionally redirect to login page (can also be handled inside the router)
    }
    return Promise.reject(error);
  }
);

export default api;
