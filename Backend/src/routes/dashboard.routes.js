const express = require('express');
const db = require('../db/database');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(verifyToken);
router.use(requireRole('admin'));

const DEPT_COLORS = {
  Engineering: '#6366f1', Sales: '#8b5cf6', Design: '#a78bfa',
  Finance: '#06b6d4', Marketing: '#10b981', Management: '#f59e0b',
  HR: '#ec4899', Operations: '#84cc16',
};

// GET /api/dashboard/admin-stats
router.get('/admin-stats', (req, res) => {
  const employees = db.prepare('SELECT * FROM employees').all();
  const pending = db.prepare("SELECT COUNT(*) c FROM leaves WHERE status='pending'").get().c;
  const today = new Date().toISOString().split('T')[0];
  const onLeaveToday = db.prepare("SELECT COUNT(*) c FROM leaves WHERE status='approved' AND ? BETWEEN from_date AND to_date").get(today).c;
  const activeEmployees = employees.filter((e) => e.status === 'active').length;

  res.json({
    totalEmployees: employees.length,
    activeEmployees,
    presentToday: Math.max(activeEmployees - onLeaveToday, 0),
    onLeaveToday,
    pendingLeaves: pending,
    departments: new Set(employees.map((e) => e.department)).size,
  });
});

// GET /api/dashboard/attendance-trend
router.get('/attendance-trend', (req, res) => {
  const rows = db.prepare(`
    SELECT date,
      SUM(CASE WHEN status IN ('present','checked_in','checked_out') THEN 1 ELSE 0 END) AS present,
      SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) AS absent
    FROM attendance
    GROUP BY date
    ORDER BY date DESC
    LIMIT 7
  `).all().reverse();

  const dayName = (d) => new Date(d).toLocaleDateString('en-US', { weekday: 'short' });
  res.json(rows.map((r) => ({ day: dayName(r.date), present: r.present, absent: r.absent })));
});

// GET /api/dashboard/department-distribution
router.get('/department-distribution', (req, res) => {
  const rows = db.prepare('SELECT department, COUNT(*) as value FROM employees GROUP BY department').all();
  res.json(rows.map((r) => ({ name: r.department, value: r.value, color: DEPT_COLORS[r.department] || '#94a3b8' })));
});

// GET /api/dashboard/monthly-payroll
router.get('/monthly-payroll', (req, res) => {
  const rows = db.prepare('SELECT month, SUM(basic_salary + hra + conveyance + medical_allowance + other_allowance) as amount FROM payroll GROUP BY month').all();
  res.json(rows.map((r) => ({ month: r.month, amount: r.amount })));
});

// GET /api/dashboard/recent-activity
router.get('/recent-activity', (req, res) => {
  const leaves = db.prepare('SELECT employee_name, status, applied_on FROM leaves ORDER BY applied_on DESC LIMIT 5').all();
  const activity = leaves.map((l, i) => ({
    id: i + 1,
    type: 'leave',
    message: `${l.employee_name} ${l.status === 'pending' ? 'applied for' : l.status} leave`,
    time: l.applied_on,
    icon: l.status === 'approved' ? 'check-circle' : 'calendar',
  }));
  res.json(activity);
});

module.exports = router;
