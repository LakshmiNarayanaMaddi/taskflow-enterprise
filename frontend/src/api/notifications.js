import axios from 'axios';

const NOTIFICATION_URL = 'http://localhost:8084';

export const notificationApi = axios.create({
  baseURL: NOTIFICATION_URL,
  headers: { 'Content-Type': 'application/json' },
});

const attachToken = (config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

notificationApi.interceptors.request.use(attachToken);

export const notificationsApi = {

  getAll: async (userId) => {
    const response = await notificationApi.get(
      `/api/notifications/user/${userId}`);
    return response.data;
  },

  getUnreadCount: async (userId) => {
    const response = await notificationApi.get(
      `/api/notifications/user/${userId}/unread-count`);
    return response.data;
  },

  markAllAsRead: async (userId) => {
    await notificationApi.patch(
      `/api/notifications/user/${userId}/read-all`);
  },

  markAsRead: async (notificationId) => {
    await notificationApi.patch(
      `/api/notifications/${notificationId}/read`);
  },
};