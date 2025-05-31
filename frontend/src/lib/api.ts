import axios from 'axios';

const api = axios.create({
  baseURL: 'https://creligens.onrender.com/api',
  // baseURL: import.meta.env.VITE_API_URL || 'https://creligens.onrender.com/',
});

// Add error handling interceptor
api.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error.response?.data || { message: 'Network Error' });
  }
);

export const authApi = {
  signUp: (data: { email: string; password: string; displayName: string }) =>
    api.post('/auth/signup', data),
  verifyEmail: (data: { email: string; verificationCode: string }) =>
    api.post('/auth/verify-email', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  resetPassword: (data: { email: string; resetCode: string; newPassword: string }) =>
    api.post('/auth/reset-password', data),
};

// Export the api instance as default
export default api;