import axios from 'axios';

// Base URLs for our microservices
const IDENTITY_URL = 'http://localhost:8082';
const PROJECT_URL  = 'http://localhost:8083';

// Identity Service client
export const identityApi = axios.create({
  baseURL: IDENTITY_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Project Service client
export const projectApi = axios.create({
  baseURL: PROJECT_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Automatically attach JWT token to every request
const attachToken = (config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Automatically redirect to login on 401
const handleAuthError = (error) => {
  if (error.response?.status === 401 ||
      error.response?.status === 403) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  return Promise.reject(error);
};

identityApi.interceptors.request.use(attachToken);
identityApi.interceptors.response.use(
  response => response,
  handleAuthError
);

projectApi.interceptors.request.use(attachToken);
projectApi.interceptors.response.use(
  response => response,
  handleAuthError
);