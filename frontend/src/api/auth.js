import { identityApi } from './axios';

export const authApi = {

  register: async (data) => {
    const response = await identityApi.post('/api/auth/register', data);
    return response.data;
  },

  login: async (data) => {
    const response = await identityApi.post('/api/auth/login', data);
    return response.data;
  },

  getMe: async () => {
    const response = await identityApi.get('/api/auth/me');
    return response.data;
  },
};