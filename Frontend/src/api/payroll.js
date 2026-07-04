import api from './axios';

export const payrollAPI = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/payroll', { params });
    return data; // { data, total }
  },

  // `employeeId` kept for backward compatibility with existing call sites;
  // the backend identifies the employee from the auth token.
  getMySlip: async (_employeeId, month) => {
    const { data } = await api.get('/payroll/my', { params: month ? { month } : {} });
    return data;
  },

  getSummary: async () => {
    const { data } = await api.get('/payroll/summary');
    return data;
  },

  generateSlip: async (id) => {
    const { data } = await api.post(`/payroll/${id}/generate`);
    return data;
  },

  getAvailableMonths: async () => {
    const { data } = await api.get('/payroll/months');
    return data;
  },
};
