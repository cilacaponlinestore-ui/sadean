import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        document.cookie = `sadean_token=${accessToken}; path=/; max-age=604800`;

        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        document.cookie = 'sadean_token=; path=/; max-age=0';
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    role?: string;
  }) => api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  logout: () => api.post('/auth/logout'),

  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),
};

// Users API
export const usersApi = {
  getProfile: () => api.get('/users/profile'),

  updateProfile: (data: { name?: string; phone?: string }) =>
    api.put('/users/profile', data),
};

// Sellers API
export const sellersApi = {
  create: (data: {
    storeName: string;
    description?: string;
    address?: string;
    phone?: string;
    whatsapp?: string;
  }) => api.post('/sellers', data),

  getMyStore: () => api.get('/sellers/my-store'),

  update: (id: string, data: any) => api.put(`/sellers/${id}`, data),

  getDashboard: () => api.get('/sellers/dashboard'),
};

// Favorites API
export const favoritesApi = {
  list: () => api.get('/favorites'),
  toggle: (productId: string) => api.post(`/favorites/${productId}/toggle`),
  check: (productId: string) => api.get(`/favorites/${productId}/check`),
};

// Admin API
export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
};

export default api;