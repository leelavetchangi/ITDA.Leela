import api from './api';

const memberService = {
  list: (params) => api.get('/members', { params }),
  get: (id) => api.get(`/members/${id}`),
  create: (member) => api.post('/members', member),
  update: (id, member) => api.put(`/members/${id}`, member),
  remove: (id) => api.delete(`/members/${id}`),
  renew: (id) => api.post(`/members/${id}/renew`),
  expiring: (days = 7) => api.get('/members/expiring', { params: { days } }),
};

export default memberService;