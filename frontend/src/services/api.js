import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===== Auth =====
export const authAPI = {
  adminLogin: (password) => api.post('/auth/admin/login', { password }),
  coupleLogin: (loginCode) => api.post('/auth/couple/login', { loginCode }),
  verifySession: () => api.get('/auth/verify'),
};

// ===== Admin - Couples =====
export const couplesAPI = {
  getAll: () => api.get('/admin/couples'),
  create: (coupleName) => api.post('/admin/couples', { coupleName }),
  update: (id, coupleName) => api.put(`/admin/couples/${id}`, { coupleName }),
  delete: (id) => api.delete(`/admin/couples/${id}`),
  regenerateCode: (id) => api.post(`/admin/couples/${id}/regenerate-code`),
};

// ===== Admin - Sufganiot =====
export const sufganiotAPI = {
  getAll: () => api.get('/admin/sufganiot'),
  create: (name, coupleId) => api.post('/admin/sufganiot', { name, coupleId }),
  update: (id, name) => api.put(`/admin/sufganiot/${id}`, { name }),
  delete: (id) => api.delete(`/admin/sufganiot/${id}`),
  uploadPhoto: (id, file) => {
    const formData = new FormData();
    formData.append('photo', file);
    return api.post(`/admin/sufganiot/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ===== Admin - Results & Settings =====
export const adminAPI = {
  getResults: () => api.get('/admin/results'),
  getComments: () => api.get('/admin/comments'),
  getSettings: () => api.get('/admin/settings'),
  openVoting: () => api.post('/admin/voting/open'),
  closeVoting: () => api.post('/admin/voting/close'),
  publishResults: () => api.post('/admin/results/publish'),
  unpublishResults: () => api.post('/admin/results/unpublish'),
};

// ===== Voting =====
export const votingAPI = {
  getStatus: () => api.get('/voting/status'),
  getSufganiot: () => api.get('/voting/sufganiot'),
  getMyVotes: () => api.get('/voting/my-votes'),
  submitRankings: (category, rankings) =>
    api.post('/voting/rankings', { category, rankings }),
  addComment: (sufganiaId, commentText) =>
    api.post('/voting/comments', { sufganiaId, commentText }),
  getSufganiaComments: (sufganiaId) =>
    api.get(`/voting/sufganiot/${sufganiaId}/comments`),
};

// ===== Results =====
export const resultsAPI = {
  getPublished: () => api.get('/results'),
  getGallery: () => api.get('/results/gallery'),
};

export default api;
