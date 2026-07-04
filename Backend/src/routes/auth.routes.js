const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

function toSafeUser(row) {
  if (!row) return null;
  const { password_hash, join_date, ...rest } = row;
  return { ...rest, joinDate: join_date };
}

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
}

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const row = db.prepare('SELECT * FROM employees WHERE email = ?').get(email);
  if (!row || !bcrypt.compareSync(password, row.password_hash)) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const user = toSafeUser(row);
  const token = signToken(user);
  res.json({ token, user });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { name, email, password, role, department, position, phone, gender } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  const exists = db.prepare('SELECT id FROM employees WHERE email = ?').get(email);
  if (exists) {
    return res.status(409).json({ message: 'Email already in use' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const joinDate = new Date().toISOString().split('T')[0];

  const result = db.prepare(`
    INSERT INTO employees (name, email, password_hash, role, department, position, phone, gender, salary, status, join_date, avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 'active', ?, NULL)
  `).run(name, email, passwordHash, role === 'admin' ? 'admin' : 'employee', department || 'General', position || 'Employee', phone || null, gender || null, joinDate);

  db.prepare(`
    INSERT INTO leave_balances (employee_id, annual_total, annual_used, sick_total, sick_used, casual_total, casual_used)
    VALUES (?, 18, 0, 10, 0, 6, 0)
  `).run(result.lastInsertRowid);

  const row = db.prepare('SELECT * FROM employees WHERE id = ?').get(result.lastInsertRowid);
  const user = toSafeUser(row);
  const token = signToken(user);
  res.status(201).json({ token, user });
});

// GET /api/auth/profile
router.get('/profile', verifyToken, (req, res) => {
  const row = db.prepare('SELECT * FROM employees WHERE id = ?').get(req.user.id);
  if (!row) return res.status(404).json({ message: 'Not authenticated' });
  res.json(toSafeUser(row));
});

module.exports = { router, toSafeUser };
