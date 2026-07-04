import api from './axios';

export const employeeAPI = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/employees', { params });
    return data; // { data, total }
  },

  getById: async (id) => {
    const { data } = await api.get(`/employees/${id}`);
    return data;
  },

  create: async (data) => {
    const { data: res } = await api.post('/employees', data);
    return res;
  },

  update: async (id, data) => {
    const { data: res } = await api.put(`/employees/${id}`, data);
    return res;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/employees/${id}`);
    return data; // { success: true }
  },

  getDepartments: async () => {
    const { data } = await api.get('/employees/departments/list');
    return data;
  },
};
