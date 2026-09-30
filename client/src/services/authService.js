import api from './api';

const authService = {
  register: (details) => api.post('/auth/register', details),
  login: (credentials) => api.post('/auth/login', credentials),
  me: () => api.get('/auth/me'),
};

export default authService;