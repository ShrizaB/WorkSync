import { format, subDays } from 'date-fns';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

let leaves = [
  { id: 1, employeeId: 2, employeeName: 'Sarah Connor', type: 'Annual Leave', from: '2024-06-10', to: '2024-06-12', days: 3, reason: 'Family vacation', status: 'approved', appliedOn: '2024-06-05' },
  { id: 2, employeeId: 2, employeeName: 'Sarah Connor', type: 'Sick Leave',   from: '2024-07-02', to: '2024-07-03', days: 2, reason: 'Fever and cold',   status: 'approved', appliedOn: '2024-07-01' },
  { id: 3, employeeId: 3, employeeName: 'Marcus Rivera', type: 'Annual Leave', from: '2024-07-15', to: '2024-07-19', days: 5, reason: 'Personal trip',   status: 'pending',  appliedOn: '2024-07-10' },
  { id: 4, employeeId: 4, employeeName: 'Priya Patel',  type: 'Casual Leave', from: '2024-07-22', to: '2024-07-22', days: 1, reason: 'Personal work',   status: 'pending',  appliedOn: '2024-07-18' },
  { id: 5, employeeId: 5, employeeName: 'James Wu',     type: 'Sick Leave',   from: '2024-06-28', to: '2024-06-28', days: 1, reason: 'Doctor visit',    status: 'rejected', appliedOn: '2024-06-27' },
  { id: 6, employeeId: 2, employeeName: 'Sarah Connor', type: 'Annual Leave', from: '2024-08-05', to: '2024-08-09', days: 5, reason: 'Travel',          status: 'pending',  appliedOn: format(subDays(new Date(), 1), 'yyyy-MM-dd') },
];

const leaveBalance = {
  annual:  { total: 18, used: 8, remaining: 10 },
  sick:    { total: 10, used: 2, remaining: 8 },
  casual:  { total: 6,  used: 1, remaining: 5 },
};

export const leaveAPI = {
  apply: async (data, user) => {
    await delay(600);
    const newLeave = {
      id: leaves.length + 1,
      employeeId: user.id,
      employeeName: user.name,
      ...data,
      status: 'pending',
      appliedOn: format(new Date(), 'yyyy-MM-dd'),
    };
    leaves.push(newLeave);
    return newLeave;
  },

  getMyLeaves: async (userId) => {
    await delay(400);
    return leaves.filter(l => l.employeeId === userId);
  },

  getAllLeaves: async (params = {}) => {
    await delay(400);
    let data = [...leaves];
    if (params.status && params.status !== 'all') data = data.filter(l => l.status === params.status);
    return { data, total: data.length };
  },

  getPendingLeaves: async () => {
    await delay(300);
    return leaves.filter(l => l.status === 'pending');
  },

  approve: async (id) => {
    await delay(500);
    const idx = leaves.findIndex(l => l.id === id);
    if (idx === -1) throw new Error('Leave not found');
    leaves[idx] = { ...leaves[idx], status: 'approved' };
    return leaves[idx];
  },

  reject: async (id) => {
    await delay(500);
    const idx = leaves.findIndex(l => l.id === id);
    if (idx === -1) throw new Error('Leave not found');
    leaves[idx] = { ...leaves[idx], status: 'rejected' };
    return leaves[idx];
  },

  getBalance: async () => {
    await delay(200);
    return leaveBalance;
  },
};
