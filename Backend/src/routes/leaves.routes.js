const express = require('express');
const db = require('../db/database');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(verifyToken);

function toLeave(row) {
  if (!row) return null;
  return {
    id: row.id,
    employeeId: row.employee_id,
    employeeName: row.employee_name,
    type: row.type,
    from: row.from_date,
    to: row.to_date,
    days: row.days,
    reason: row.reason,
    status: row.status,
    appliedOn: row.applied_on,
  };
}

function bumpBalance(employeeId, type, days) {
  const col = type.toLowerCase().includes('sick') ? 'sick_used'
    : type.toLowerCase().includes('casual') ? 'casual_used'
    : 'annual_used';
  db.prepare(`UPDATE leave_balances SET ${col} = ${col} + ? WHERE employee_id = ?`).run(days, employeeId);
}

// POST /api/leaves  (apply)
router.post('/', (req, res) => {
  const { type, from, to, days, reason } = req.body;
  if (!type || !from || !to || !days) {
    return res.status(400).json({ message: 'type, from, to and days are required' });
  }
  const appliedOn = new Date().toISOString().split('T')[0];
  const result = db.prepare(`
    INSERT INTO leaves (employee_id, employee_name, type, from_date, to_date, days, reason, status, applied_on)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)
  `).run(req.user.id, req.user.name, type, from, to, days, reason || '', appliedOn);

  const row = db.prepare('SELECT * FROM leaves WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(toLeave(row));
});

// GET /api/leaves/my
router.get('/my', (req, res) => {
  const rows = db.prepare('SELECT * FROM leaves WHERE employee_id = ? ORDER BY applied_on DESC').all(req.user.id);
  res.json(rows.map(toLeave));
});

// GET /api/leaves/pending  (admin)
router.get('/pending', requireRole('admin'), (req, res) => {
  const rows = db.prepare("SELECT * FROM leaves WHERE status = 'pending' ORDER BY applied_on DESC").all();
  res.json(rows.map(toLeave));
});

// GET /api/leaves/balance
router.get('/balance', (req, res) => {
  const row = db.prepare('SELECT * FROM leave_balances WHERE employee_id = ?').get(req.user.id);
  if (!row) {
    return res.json({
      annual: { total: 18, used: 0, remaining: 18 },
      sick: { total: 10, used: 0, remaining: 10 },
      casual: { total: 6, used: 0, remaining: 6 },
    });
  }
  res.json({
    annual: { total: row.annual_total, used: row.annual_used, remaining: row.annual_total - row.annual_used },
    sick: { total: row.sick_total, used: row.sick_used, remaining: row.sick_total - row.sick_used },
    casual: { total: row.casual_total, used: row.casual_used, remaining: row.casual_total - row.casual_used },
  });
});

// GET /api/leaves?status=  (admin — all leaves)
router.get('/', requireRole('admin'), (req, res) => {
  const { status } = req.query;
  let rows = db.prepare('SELECT * FROM leaves ORDER BY applied_on DESC').all();
  if (status && status !== 'all') rows = rows.filter((l) => l.status === status);
  const data = rows.map(toLeave);
  res.json({ data, total: data.length });
});

// PUT /api/leaves/:id/approve  (admin)
router.put('/:id/approve', requireRole('admin'), (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare('SELECT * FROM leaves WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ message: 'Leave not found' });
  db.prepare("UPDATE leaves SET status = 'approved' WHERE id = ?").run(id);
  if (row.status !== 'approved') bumpBalance(row.employee_id, row.type, row.days);
  const updated = db.prepare('SELECT * FROM leaves WHERE id = ?').get(id);
  res.json(toLeave(updated));
});

// PUT /api/leaves/:id/reject  (admin)
router.put('/:id/reject', requireRole('admin'), (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare('SELECT * FROM leaves WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ message: 'Leave not found' });
  db.prepare("UPDATE leaves SET status = 'rejected' WHERE id = ?").run(id);
  const updated = db.prepare('SELECT * FROM leaves WHERE id = ?').get(id);
  res.json(toLeave(updated));
});

module.exports = router;
