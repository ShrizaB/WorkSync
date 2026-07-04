const express = require('express');
const db = require('../db/database');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(verifyToken);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function withTotals(row) {
  const grossSalary = row.basic_salary + row.hra + row.conveyance + row.medical_allowance + row.other_allowance;
  const totalDeductions = row.pf + row.professional_tax + row.tds + row.loan_deduction;
  return {
    id: row.id,
    employeeId: row.employee_id,
    employeeName: row.employee_name,
    department: row.department,
    month: row.month,
    basicSalary: row.basic_salary,
    hra: row.hra,
    conveyance: row.conveyance,
    medicalAllowance: row.medical_allowance,
    otherAllowance: row.other_allowance,
    pf: row.pf,
    professionalTax: row.professional_tax,
    tds: row.tds,
    loanDeduction: row.loan_deduction,
    status: row.status,
    paidOn: row.paid_on,
    grossSalary,
    totalDeductions,
    netSalary: grossSalary - totalDeductions,
  };
}

// GET /api/payroll?month=&status=  (admin)
router.get('/', requireRole('admin'), (req, res) => {
  const { month, status } = req.query;
  let rows = db.prepare('SELECT * FROM payroll').all();
  if (month) rows = rows.filter((r) => r.month === month);
  if (status && status !== 'all') rows = rows.filter((r) => r.status === status);
  const data = rows.map(withTotals);
  res.json({ data, total: data.length });
});

// GET /api/payroll/summary  (admin)
router.get('/summary', requireRole('admin'), (req, res) => {
  const rows = db.prepare('SELECT * FROM payroll').all().map(withTotals);
  const totalPayroll = rows.reduce((s, r) => s + r.netSalary, 0);
  const paid = rows.filter((r) => r.status === 'paid').length;
  const pending = rows.filter((r) => r.status === 'pending').length;
  const monthlyTrend = MONTHS.slice(0, 6).map((m) => ({
    month: m,
    amount: Math.round(totalPayroll * (0.85 + Math.random() * 0.3)),
  }));
  res.json({ totalPayroll, paid, pending, monthlyTrend });
});

// GET /api/payroll/months
router.get('/months', (req, res) => {
  res.json(MONTHS.slice(0, 6).map((m) => `${m} 2024`));
});

// GET /api/payroll/my?month=
router.get('/my', (req, res) => {
  const row = db.prepare('SELECT * FROM payroll WHERE employee_id = ? ORDER BY id DESC').get(req.user.id);
  if (!row) return res.status(404).json({ message: 'Salary slip not found' });
  res.json(withTotals(row));
});

// POST /api/payroll/:id/generate  (admin)
router.post('/:id/generate', requireRole('admin'), (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare('SELECT * FROM payroll WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ message: 'Record not found' });
  const paidOn = new Date().toISOString().split('T')[0];
  db.prepare("UPDATE payroll SET status = 'paid', paid_on = ? WHERE id = ?").run(paidOn, id);
  const updated = db.prepare('SELECT * FROM payroll WHERE id = ?').get(id);
  res.json(withTotals(updated));
});

module.exports = router;
