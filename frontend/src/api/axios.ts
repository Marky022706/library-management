import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const getCsrfCookie = async () => {
  try {
    await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
  } catch {
    // Ignore CSRF cookie fetch error for Bearer token fallback
  }
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bpl_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('bpl_auth_token');
      localStorage.removeItem('bpl_user_data');
    }
    return Promise.reject(error);
  }
);

export default api;
