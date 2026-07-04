import api from './axios';

export const attendanceAPI = {
  getTodayStatus: async () => {
    const { data } = await api.get('/attendance/today');
    return data;
  },

  checkIn: async () => {
    const { data } = await api.post('/attendance/checkin');
    return data;
  },

  checkOut: async () => {
    const { data } = await api.post('/attendance/checkout');
    return data;
  },

  getHistory: async (params = {}) => {
    const { data } = await api.get('/attendance/history', { params });
    return data; // { data, total }
  },

  getCalendar: async (month) => {
    const { data } = await api.get('/attendance/calendar', { params: { month } });
    return data;
  },

  getStats: async () => {
    const { data } = await api.get('/attendance/stats');
    return data;
  },
};
