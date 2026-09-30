import api from './api';

const planService = {
  list: (params) => api.get('/plans', { params }),
  get: (id) => api.get(`/plans/${id}`),
  create: (plan) => api.post('/plans', plan),
  update: (id, plan) => api.put(`/plans/${id}`, plan),
  remove: (id) => api.delete(`/plans/${id}`),
};

export default planService;