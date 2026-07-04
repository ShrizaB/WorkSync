import api from './axios';

export const leaveAPI = {
  // `user` is accepted for backward compatibility with existing call sites
  // (leaveAPI.apply({...}, user)) but the backend derives the employee from
  // the auth token, so it isn't sent to the server.
  apply: async (data) => {
    const { data: res } = await api.post('/leaves', data);
    return res;
  },

  getMyLeaves: async () => {
    const { data } = await api.get('/leaves/my');
    return data;
  },

  getAllLeaves: async (params = {}) => {
    const { data } = await api.get('/leaves', { params });
    return data; // { data, total }
  },

  getPendingLeaves: async () => {
    const { data } = await api.get('/leaves/pending');
    return data;
  },

  approve: async (id) => {
    const { data } = await api.put(`/leaves/${id}/approve`);
    return data;
  },

  reject: async (id) => {
    const { data } = await api.put(`/leaves/${id}/reject`);
    return data;
  },

  getBalance: async () => {
    const { data } = await api.get('/leaves/balance');
    return data;
  },
};
