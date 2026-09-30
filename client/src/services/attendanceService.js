import api from './api';

const attendanceService = {
  checkIn: (memberId) => api.post('/checkin', { memberId }),
  list: (memberId, params) => api.get(`/members/${memberId}/attendance`, { params }),
};

export default attendanceService;