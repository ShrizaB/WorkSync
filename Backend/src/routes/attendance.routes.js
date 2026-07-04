const express = require('express');
const db = require('../db/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();
router.use(verifyToken);

const todayStr = () => new Date().toISOString().split('T')[0];
const timeStr = () => {
  const d = new Date();
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${String(h).padStart(2, '0')}:${m} ${ampm}`;
};

function toRecord(row) {
  if (!row) return null;
  return { date: row.date, checkIn: row.check_in, checkOut: row.check_out, hours: row.hours, status: row.status };
}

// GET /api/attendance/today
router.get('/today', (req, res) => {
  const row = db.prepare('SELECT * FROM attendance WHERE employee_id = ? AND date = ?').get(req.user.id, todayStr());
  if (!row) return res.json({ date: todayStr(), checkIn: null, checkOut: null, status: 'not_checked_in' });
  res.json(toRecord(row));
});

// POST /api/attendance/checkin
router.post('/checkin', (req, res) => {
  const date = todayStr();
  const existing = db.prepare('SELECT * FROM attendance WHERE employee_id = ? AND date = ?').get(req.user.id, date);
  if (existing?.check_in) return res.status(400).json({ message: 'Already checked in' });

  const checkIn = timeStr();
  if (existing) {
    db.prepare('UPDATE attendance SET check_in=?, status=? WHERE id=?').run(checkIn, 'checked_in', existing.id);
  } else {
    db.prepare('INSERT INTO attendance (employee_id, date, check_in, status) VALUES (?, ?, ?, ?)').run(req.user.id, date, checkIn, 'checked_in');
  }
  const row = db.prepare('SELECT * FROM attendance WHERE employee_id = ? AND date = ?').get(req.user.id, date);
  res.json(toRecord(row));
});

// POST /api/attendance/checkout
router.post('/checkout', (req, res) => {
  const date = todayStr();
  const existing = db.prepare('SELECT * FROM attendance WHERE employee_id = ? AND date = ?').get(req.user.id, date);
  if (!existing?.check_in) return res.status(400).json({ message: 'Not checked in yet' });
  if (existing.check_out) return res.status(400).json({ message: 'Already checked out' });

  const checkOut = timeStr();
  db.prepare('UPDATE attendance SET check_out=?, status=? WHERE id=?').run(checkOut, 'checked_out', existing.id);
  const row = db.prepare('SELECT * FROM attendance WHERE id = ?').get(existing.id);
  res.json(toRecord(row));
});

// GET /api/attendance/history?month=YYYY-MM&status=
router.get('/history', (req, res) => {
  const { month, status } = req.query;
  let rows = db.prepare('SELECT * FROM attendance WHERE employee_id = ? ORDER BY date DESC').all(req.user.id);
  if (month) rows = rows.filter((r) => r.date.startsWith(month));
  if (status && status !== 'all') rows = rows.filter((r) => r.status === status);
  const data = rows.map(toRecord);
  res.json({ data, total: data.length });
});

// GET /api/attendance/calendar?month=YYYY-MM
router.get('/calendar', (req, res) => {
  const { month } = req.query;
  let rows = db.prepare('SELECT * FROM attendance WHERE employee_id = ?').all(req.user.id);
  if (month) rows = rows.filter((r) => r.date.startsWith(month));
  res.json(rows.map(toRecord));
});

// GET /api/attendance/stats
router.get('/stats', (req, res) => {
  const rows = db.prepare('SELECT * FROM attendance WHERE employee_id = ?').all(req.user.id);
  const total = rows.length;
  const present = rows.filter((r) => r.status === 'present').length;
  const absent = rows.filter((r) => r.status === 'absent').length;
  const leave = rows.filter((r) => r.status === 'leave').length;
  res.json({ total, present, absent, leave, percentage: total ? Math.round((present / total) * 100) : 0 });
});

module.exports = router;
