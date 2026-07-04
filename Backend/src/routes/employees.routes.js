const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db/database');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

function toEmployee(row) {
  if (!row) return null;
  const { password_hash, join_date, ...rest } = row;
  return { ...rest, joinDate: join_date };
}

router.use(verifyToken);

// GET /api/employees?search=&department=&status=
router.get('/', (req, res) => {
  const { search, department, status } = req.query;
  let rows = db.prepare('SELECT * FROM employees').all();

  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter((e) =>
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q) ||
      e.position.toLowerCase().includes(q)
    );
  }
  if (department && department !== 'all') rows = rows.filter((e) => e.department === department);
  if (status && status !== 'all') rows = rows.filter((e) => e.status === status);

  const data = rows.map(toEmployee);
  res.json({ data, total: data.length });
});

// GET /api/employees/departments/list
router.get('/departments/list', (req, res) => {
  const rows = db.prepare('SELECT DISTINCT department FROM employees').all();
  res.json(rows.map((r) => r.department));
});

// GET /api/employees/:id
router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM employees WHERE id = ?').get(Number(req.params.id));
  if (!row) return res.status(404).json({ message: 'Employee not found' });
  res.json(toEmployee(row));
});

// POST /api/employees (admin only)
router.post('/', requireRole('admin'), (req, res) => {
  const { name, email, phone, gender, department, position, salary, joinDate, status } = req.body;
  if (!name || !email) return res.status(400).json({ message: 'Name and email are required' });

  const exists = db.prepare('SELECT id FROM employees WHERE email = ?').get(email);
  if (exists) return res.status(409).json({ message: 'Email already in use' });

  const defaultPassword = bcrypt.hashSync('welcome123', 10);
  const result = db.prepare(`
    INSERT INTO employees (name, email, password_hash, role, department, position, phone, gender, salary, status, join_date, avatar)
    VALUES (?, ?, ?, 'employee', ?, ?, ?, ?, ?, ?, ?, NULL)
  `).run(name, email, defaultPassword, department || 'General', position || 'Employee', phone || null, gender || null, Number(salary) || 0, status || 'active', joinDate || new Date().toISOString().split('T')[0]);

  db.prepare(`
    INSERT INTO leave_balances (employee_id, annual_total, annual_used, sick_total, sick_used, casual_total, casual_used)
    VALUES (?, 18, 0, 10, 0, 6, 0)
  `).run(result.lastInsertRowid);

  const row = db.prepare('SELECT * FROM employees WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(toEmployee(row));
});

// PUT /api/employees/:id (admin only)
router.put('/:id', requireRole('admin'), (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM employees WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ message: 'Employee not found' });

  const merged = {
    name: req.body.name ?? existing.name,
    email: req.body.email ?? existing.email,
    phone: req.body.phone ?? existing.phone,
    gender: req.body.gender ?? existing.gender,
    department: req.body.department ?? existing.department,
    position: req.body.position ?? existing.position,
    salary: req.body.salary !== undefined ? Number(req.body.salary) : existing.salary,
    status: req.body.status ?? existing.status,
    join_date: req.body.joinDate ?? existing.join_date,
  };

  db.prepare(`
    UPDATE employees SET name=?, email=?, phone=?, gender=?, department=?, position=?, salary=?, status=?, join_date=?
    WHERE id=?
  `).run(merged.name, merged.email, merged.phone, merged.gender, merged.department, merged.position, merged.salary, merged.status, merged.join_date, id);

  const row = db.prepare('SELECT * FROM employees WHERE id = ?').get(id);
  res.json(toEmployee(row));
});

// DELETE /api/employees/:id (admin only)
router.delete('/:id', requireRole('admin'), (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT id FROM employees WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ message: 'Employee not found' });
  db.prepare('DELETE FROM employees WHERE id = ?').run(id);
  res.json({ success: true });
});

module.exports = router;
