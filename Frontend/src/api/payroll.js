import { MOCK_EMPLOYEES } from './employees';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

let payrollRecords = MOCK_EMPLOYEES.map((emp) => ({
  id:           emp.id,
  employeeId:   emp.id,
  employeeName: emp.name,
  department:   emp.department,
  month:        'June 2024',
  basicSalary:  emp.salary,
  hra:          Math.round(emp.salary * 0.4),
  conveyance:   1600,
  medicalAllowance: 1250,
  otherAllowance:   800,
  pf:           Math.round(emp.salary * 0.12),
  professionalTax:  200,
  tds:          Math.round(emp.salary * 0.05),
  loanDeduction: 0,
  status:       'paid',
  paidOn:       '2024-06-30',
}));

payrollRecords = payrollRecords.map(r => ({
  ...r,
  grossSalary: r.basicSalary + r.hra + r.conveyance + r.medicalAllowance + r.otherAllowance,
  totalDeductions: r.pf + r.professionalTax + r.tds + r.loanDeduction,
  netSalary: r.basicSalary + r.hra + r.conveyance + r.medicalAllowance + r.otherAllowance
    - (r.pf + r.professionalTax + r.tds + r.loanDeduction),
}));

export const payrollAPI = {
  getAll: async (params = {}) => {
    await delay(400);
    let data = [...payrollRecords];
    if (params.month) data = data.filter(r => r.month === params.month);
    if (params.status && params.status !== 'all') data = data.filter(r => r.status === params.status);
    return { data, total: data.length };
  },

  getMySlip: async (employeeId, month) => {
    await delay(300);
    const record = payrollRecords.find(r => r.employeeId === employeeId);
    if (!record) throw new Error('Salary slip not found');
    return record;
  },

  getSummary: async () => {
    await delay(300);
    const totalPayroll = payrollRecords.reduce((s, r) => s + r.netSalary, 0);
    const paid = payrollRecords.filter(r => r.status === 'paid').length;
    const pending = payrollRecords.filter(r => r.status === 'pending').length;
    const monthlyTrend = MONTHS.slice(0, 6).map((m, i) => ({
      month: m,
      amount: Math.round(totalPayroll * (0.85 + Math.random() * 0.3)),
    }));
    return { totalPayroll, paid, pending, monthlyTrend };
  },

  generateSlip: async (id) => {
    await delay(500);
    const idx = payrollRecords.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('Record not found');
    payrollRecords[idx] = { ...payrollRecords[idx], status: 'paid', paidOn: new Date().toISOString().split('T')[0] };
    return payrollRecords[idx];
  },

  getAvailableMonths: async () => {
    await delay(100);
    return MONTHS.slice(0, 6).map(m => `${m} 2024`);
  },
};
