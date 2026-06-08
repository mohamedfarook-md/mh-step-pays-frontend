import axios from 'axios';

// const API = axios.create({ baseURL: '/api' });

// const API = axios.create({
//   baseURL: 'http://localhost:5000/api'
// });

const API = axios.create({
  baseURL: 'https://apimhsteppayshub.in/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    // if (err.response?.status === 401) {
    //   localStorage.removeItem('token');
    //   localStorage.removeItem('user');
    //   window.location.href = '/login';
    // }
    return Promise.reject(err);
  }
);


// Auth
export const adminLogin = (data) => API.post('/auth/admin/login', data);
export const agentLogin = (data) => API.post('/auth/agent/login', data);
export const agentRegister = (data) => API.post('/auth/agent/register', data);
export const logoutAPI = () => API.post('/auth/logout');
export const getMe = () => API.get('/auth/me');

// Admin
export const getAdminDashboard = () => API.get('/admin/dashboard');
export const getAgents = (params) => API.get('/admin/agents', { params });
export const updateAgentStatus = (id, data) => API.put(`/admin/agents/${id}/status`, data);
export const getAdminMerchants = (params) => API.get('/admin/merchants', { params });
export const approveMerchant = (id) => API.put(`/admin/merchants/${id}/approve`);
export const rejectMerchant = (id, data) => API.put(`/admin/merchants/${id}/reject`, data);
export const uploadQRCode = (merchantId, formData) => API.post(`/admin/merchants/${merchantId}/qr`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deployQR = (merchantId) => API.put(`/admin/merchants/${merchantId}/qr/deploy`);
export const recordTransaction = (merchantId) => API.put(`/admin/merchants/${merchantId}/transaction`);
export const activateMerchant = (merchantId) => API.put(`/admin/merchants/${merchantId}/activate`);
export const getMerchantDocuments = (merchantId) => API.get(`/admin/merchants/${merchantId}/documents`);
export const verifyDocuments = (merchantId, data) => API.put(`/admin/merchants/${merchantId}/documents/verify`, data);
export const getAuditLogs = (params) => API.get('/admin/audit-logs', { params });
export const getReports = (type, params) => API.get(`/reports/${type}`, { params });

// Agent
export const createMerchant = (data) => API.post('/merchants', data);
export const updateMerchant = (id, data) => API.put(`/merchants/${id}`, data);
export const submitMerchant = (id) => API.post(`/merchants/${id}/submit`);
export const getMyMerchants = (params) => API.get('/merchants/my', { params });
export const getAgentStats = () => API.get('/merchants/stats');
export const getMerchant = (id) => API.get(`/merchants/${id}`);
export const uploadDocuments = (merchantId, formData) => API.post(`/merchants/${merchantId}/documents`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

// Notifications
export const getNotifications = () => API.get('/notifications');
export const markNotificationRead = (id) => API.put(`/notifications/${id}/read`);
export const markAllRead = () => API.put('/notifications/read-all');

// Attendance
export const getMyAttendance = () => API.get('/attendance/my');
export const getCommissions = () => API.get('/commissions/my');

export default API;