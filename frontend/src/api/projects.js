import { projectApi } from './axios';

export const projectsApi = {

  getAll: async () => {
    const response = await projectApi.get('/api/projects');
    return response.data;
  },

  getById: async (projectId) => {
    const response = await projectApi.get(`/api/projects/${projectId}`);
    return response.data;
  },

  create: async (data) => {
    const response = await projectApi.post('/api/projects', data);
    return response.data;
  },

  update: async (projectId, data) => {
    const response = await projectApi.put(
      `/api/projects/${projectId}`, data);
    return response.data;
  },

  delete: async (projectId) => {
    await projectApi.delete(`/api/projects/${projectId}`);
  },

  // Task APIs
  getTasks: async (projectId) => {
    const response = await projectApi.get(
      `/api/projects/${projectId}/tasks`);
    return response.data;
  },

  createTask: async (projectId, data) => {
    const response = await projectApi.post(
      `/api/projects/${projectId}/tasks`, data);
    return response.data;
  },

  updateTaskStatus: async (projectId, taskId, status) => {
    const response = await projectApi.patch(
      `/api/projects/${projectId}/tasks/${taskId}/status`,
      null,
      { params: { status } }
    );
    return response.data;
  },

  deleteTask: async (projectId, taskId) => {
    await projectApi.delete(
      `/api/projects/${projectId}/tasks/${taskId}`);
  },
};