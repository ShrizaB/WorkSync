import { employeeAPI } from './employees';
import { attendanceAPI } from './attendance';
import { leaveAPI } from './leaves';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const dashboardAPI = {
  getAdminStats: async () => {
    await delay(300);
    const { data: employees } = await employeeAPI.getAll();
    const attendanceStats = await attendanceAPI.getStats();
    const pending = await leaveAPI.getPendingLeaves();

    return {
      totalEmployees: employees.length,
      activeEmployees: employees.filter(e => e.status === 'active').length,
      presentToday: employees.filter(e => e.status === 'active').length - 2,
      onLeaveToday: 2,
      pendingLeaves: pending.length,
      departments: [...new Set(employees.map(e => e.department))].length,
    };
  },

  getAttendanceTrend: async () => {
    await delay(200);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Mon', 'Tue'];
    return days.map(day => ({
      day,
      present: Math.floor(Math.random() * 3) + 7,
      absent:  Math.floor(Math.random() * 3),
    }));
  },

  getDepartmentDistribution: async () => {
    await delay(200);
    return [
      { name: 'Engineering', value: 4, color: '#6366f1' },
      { name: 'Sales',       value: 2, color: '#8b5cf6' },
      { name: 'Design',      value: 2, color: '#a78bfa' },
      { name: 'Finance',     value: 1, color: '#06b6d4' },
      { name: 'Marketing',   value: 1, color: '#10b981' },
    ];
  },

  getMonthlyPayroll: async () => {
    await delay(200);
    return [
      { month: 'Jan', amount: 820000 },
      { month: 'Feb', amount: 840000 },
      { month: 'Mar', amount: 835000 },
      { month: 'Apr', amount: 860000 },
      { month: 'May', amount: 875000 },
      { month: 'Jun', amount: 890000 },
    ];
  },

  getRecentActivity: async () => {
    await delay(300);
    return [
      { id: 1, type: 'leave',    message: 'Sarah Connor applied for Annual Leave', time: '2h ago', icon: 'calendar' },
      { id: 2, type: 'employee', message: 'Ava Brown joined the Design team',       time: '4h ago', icon: 'user-plus' },
      { id: 3, type: 'payroll',  message: 'June payroll processed successfully',    time: '1d ago', icon: 'dollar-sign' },
      { id: 4, type: 'leave',    message: 'Marcus Rivera leave request approved',   time: '1d ago', icon: 'check-circle' },
      { id: 5, type: 'employee', message: 'Priya Patel updated her profile',        time: '2d ago', icon: 'edit' },
    ];
  },
};
