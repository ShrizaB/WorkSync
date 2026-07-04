import api from './axios';

export const dashboardAPI = {
  getAdminStats: async () => {
    const { data } = await api.get('/dashboard/admin-stats');
    return data;
  },

  getAttendanceTrend: async () => {
    const { data } = await api.get('/dashboard/attendance-trend');
    return data;
  },

  getDepartmentDistribution: async () => {
    const { data } = await api.get('/dashboard/department-distribution');
    return data;
  },

  getMonthlyPayroll: async () => {
    const { data } = await api.get('/dashboard/monthly-payroll');
    return data;
  },

  getRecentActivity: async () => {
    const { data } = await api.get('/dashboard/recent-activity');
    return data;
  },
};
