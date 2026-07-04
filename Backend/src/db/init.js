const bcrypt = require('bcryptjs');
const db = require('./database');

const RESET = process.argv.includes('--reset');

if (RESET) {
  db.exec(`
    DROP TABLE IF EXISTS payroll;
    DROP TABLE IF EXISTS leaves;
    DROP TABLE IF EXISTS leave_balances;
    DROP TABLE IF EXISTS attendance;
    DROP TABLE IF EXISTS employees;
  `);
}

db.exec(`
  CREATE TABLE IF NOT EXISTS employees (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT NOT NULL,
    email           TEXT NOT NULL UNIQUE,
    password_hash   TEXT NOT NULL,
    role            TEXT NOT NULL DEFAULT 'employee', -- 'admin' | 'employee'
    department      TEXT NOT NULL DEFAULT 'General',
    position        TEXT NOT NULL DEFAULT 'Employee',
    phone           TEXT,
    gender          TEXT,
    salary          INTEGER NOT NULL DEFAULT 0,
    status          TEXT NOT NULL DEFAULT 'active', -- 'active' | 'inactive'
    join_date       TEXT NOT NULL,
    avatar          TEXT
  );

  CREATE TABLE IF NOT EXISTS attendance (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    date        TEXT NOT NULL,
    check_in    TEXT,
    check_out   TEXT,
    hours       TEXT DEFAULT '0',
    status      TEXT NOT NULL DEFAULT 'not_checked_in', -- present|absent|leave|checked_in|checked_out|not_checked_in
    UNIQUE(employee_id, date)
  );

  CREATE TABLE IF NOT EXISTS leaves (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id   INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    employee_name TEXT NOT NULL,
    type          TEXT NOT NULL,
    from_date     TEXT NOT NULL,
    to_date       TEXT NOT NULL,
    days          INTEGER NOT NULL,
    reason        TEXT,
    status        TEXT NOT NULL DEFAULT 'pending', -- pending|approved|rejected
    applied_on    TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS leave_balances (
    employee_id     INTEGER PRIMARY KEY REFERENCES employees(id) ON DELETE CASCADE,
    annual_total    INTEGER NOT NULL DEFAULT 18,
    annual_used     INTEGER NOT NULL DEFAULT 0,
    sick_total      INTEGER NOT NULL DEFAULT 10,
    sick_used       INTEGER NOT NULL DEFAULT 0,
    casual_total    INTEGER NOT NULL DEFAULT 6,
    casual_used     INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS payroll (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id       INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    employee_name     TEXT NOT NULL,
    department        TEXT NOT NULL,
    month             TEXT NOT NULL,
    basic_salary      INTEGER NOT NULL,
    hra               INTEGER NOT NULL,
    conveyance        INTEGER NOT NULL,
    medical_allowance INTEGER NOT NULL,
    other_allowance   INTEGER NOT NULL,
    pf                INTEGER NOT NULL,
    professional_tax  INTEGER NOT NULL,
    tds               INTEGER NOT NULL,
    loan_deduction    INTEGER NOT NULL DEFAULT 0,
    status            TEXT NOT NULL DEFAULT 'pending', -- pending|paid
    paid_on           TEXT
  );
`);

const employeeCount = db.prepare('SELECT COUNT(*) AS c FROM employees').get().c;

if (employeeCount === 0) {
  console.log('Seeding database with demo data...');

  const insertEmployee = db.prepare(`
    INSERT INTO employees (name, email, password_hash, role, department, position, phone, gender, salary, status, join_date, avatar)
    VALUES (@name, @email, @password_hash, @role, @department, @position, @phone, @gender, @salary, @status, @join_date, @avatar)
  `);

  const employees = [
    { name: 'Alex Johnson', email: 'admin@worksync.com', password: 'admin123', role: 'admin', department: 'Management', position: 'HR Manager', phone: '+1 555-0101', gender: 'Male', salary: 95000, status: 'active', join_date: '2021-01-15' },
    { name: 'Sarah Connor', email: 'employee@worksync.com', password: 'emp123', role: 'employee', department: 'Engineering', position: 'Software Engineer', phone: '+1 555-0102', gender: 'Female', salary: 85000, status: 'active', join_date: '2022-06-01' },
    { name: 'Marcus Rivera', email: 'marcus.rivera@worksync.com', password: 'password123', role: 'employee', department: 'Engineering', position: 'Senior Engineer', phone: '+1 555-0103', gender: 'Male', salary: 105000, status: 'active', join_date: '2020-03-10' },
    { name: 'Priya Patel', email: 'priya.patel@worksync.com', password: 'password123', role: 'employee', department: 'Design', position: 'UX Designer', phone: '+1 555-0104', gender: 'Female', salary: 78000, status: 'active', join_date: '2023-02-14' },
    { name: 'James Wu', email: 'james.wu@worksync.com', password: 'password123', role: 'employee', department: 'Sales', position: 'Sales Executive', phone: '+1 555-0105', gender: 'Male', salary: 72000, status: 'active', join_date: '2021-09-20' },
    { name: 'Emma Davis', email: 'emma.davis@worksync.com', password: 'password123', role: 'employee', department: 'Finance', position: 'Financial Analyst', phone: '+1 555-0106', gender: 'Female', salary: 88000, status: 'active', join_date: '2022-11-30' },
    { name: 'Liam Thompson', email: 'liam.thompson@worksync.com', password: 'password123', role: 'employee', department: 'Marketing', position: 'Marketing Specialist', phone: '+1 555-0107', gender: 'Male', salary: 68000, status: 'inactive', join_date: '2023-05-01' },
    { name: 'Olivia Martinez', email: 'olivia.martinez@worksync.com', password: 'password123', role: 'employee', department: 'Engineering', position: 'QA Engineer', phone: '+1 555-0108', gender: 'Female', salary: 75000, status: 'active', join_date: '2022-08-15' },
    { name: 'Noah Wilson', email: 'noah.wilson@worksync.com', password: 'password123', role: 'employee', department: 'Sales', position: 'Account Manager', phone: '+1 555-0109', gender: 'Male', salary: 80000, status: 'active', join_date: '2021-12-01' },
    { name: 'Ava Brown', email: 'ava.brown@worksync.com', password: 'password123', role: 'employee', department: 'Design', position: 'Graphic Designer', phone: '+1 555-0110', gender: 'Female', salary: 65000, status: 'active', join_date: '2023-07-10' },
  ];

  for (const emp of employees) {
    insertEmployee.run({
      name: emp.name,
      email: emp.email,
      password_hash: bcrypt.hashSync(emp.password, 10),
      role: emp.role,
      department: emp.department,
      position: emp.position,
      phone: emp.phone,
      gender: emp.gender,
      salary: emp.salary,
      status: emp.status,
      join_date: emp.join_date,
      avatar: null,
    });
  }

  const insertBalance = db.prepare(`
    INSERT INTO leave_balances (employee_id, annual_total, annual_used, sick_total, sick_used, casual_total, casual_used)
    VALUES (?, 18, 8, 10, 2, 6, 1)
  `);
  for (let id = 1; id <= employees.length; id++) insertBalance.run(id);

  const insertLeave = db.prepare(`
    INSERT INTO leaves (employee_id, employee_name, type, from_date, to_date, days, reason, status, applied_on)
    VALUES (@employee_id, @employee_name, @type, @from_date, @to_date, @days, @reason, @status, @applied_on)
  `);
  const leaves = [
    { employee_id: 2, employee_name: 'Sarah Connor', type: 'Annual Leave', from_date: '2024-06-10', to_date: '2024-06-12', days: 3, reason: 'Family vacation', status: 'approved', applied_on: '2024-06-05' },
    { employee_id: 2, employee_name: 'Sarah Connor', type: 'Sick Leave', from_date: '2024-07-02', to_date: '2024-07-03', days: 2, reason: 'Fever and cold', status: 'approved', applied_on: '2024-07-01' },
    { employee_id: 3, employee_name: 'Marcus Rivera', type: 'Annual Leave', from_date: '2024-07-15', to_date: '2024-07-19', days: 5, reason: 'Personal trip', status: 'pending', applied_on: '2024-07-10' },
    { employee_id: 4, employee_name: 'Priya Patel', type: 'Casual Leave', from_date: '2024-07-22', to_date: '2024-07-22', days: 1, reason: 'Personal work', status: 'pending', applied_on: '2024-07-18' },
    { employee_id: 5, employee_name: 'James Wu', type: 'Sick Leave', from_date: '2024-06-28', to_date: '2024-06-28', days: 1, reason: 'Doctor visit', status: 'rejected', applied_on: '2024-06-27' },
    { employee_id: 2, employee_name: 'Sarah Connor', type: 'Annual Leave', from_date: '2024-08-05', to_date: '2024-08-09', days: 5, reason: 'Travel', status: 'pending', applied_on: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
  ];
  for (const l of leaves) insertLeave.run(l);

  const insertPayroll = db.prepare(`
    INSERT INTO payroll (employee_id, employee_name, department, month, basic_salary, hra, conveyance, medical_allowance, other_allowance, pf, professional_tax, tds, loan_deduction, status, paid_on)
    VALUES (@employee_id, @employee_name, @department, @month, @basic_salary, @hra, @conveyance, @medical_allowance, @other_allowance, @pf, @professional_tax, @tds, @loan_deduction, @status, @paid_on)
  `);
  employees.forEach((emp, i) => {
    const id = i + 1;
    insertPayroll.run({
      employee_id: id,
      employee_name: emp.name,
      department: emp.department,
      month: 'June 2024',
      basic_salary: emp.salary,
      hra: Math.round(emp.salary * 0.4),
      conveyance: 1600,
      medical_allowance: 1250,
      other_allowance: 800,
      pf: Math.round(emp.salary * 0.12),
      professional_tax: 200,
      tds: Math.round(emp.salary * 0.05),
      loan_deduction: 0,
      status: 'paid',
      paid_on: '2024-06-30',
    });
  });

  // Generate a month of weekday attendance history for every employee (up to yesterday)
  const insertAttendance = db.prepare(`
    INSERT OR IGNORE INTO attendance (employee_id, date, check_in, check_out, hours, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const statuses = ['present', 'present', 'present', 'present', 'absent', 'leave'];
  for (let id = 1; id <= employees.length; id++) {
    for (let d = new Date(startOfMonth); d < today; d.setDate(d.getDate() + 1)) {
      const dow = d.getDay();
      if (dow === 0 || dow === 6) continue; // skip weekends
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const dateStr = d.toISOString().split('T')[0];
      const checkIn = status === 'present' ? `09:${String(Math.floor(Math.random() * 30)).padStart(2, '0')} AM` : null;
      const checkOut = status === 'present' ? `06:${String(Math.floor(Math.random() * 30)).padStart(2, '0')} PM` : null;
      const hours = status === 'present' ? (8 + Math.random()).toFixed(1) : '0';
      insertAttendance.run(id, dateStr, checkIn, checkOut, hours, status);
    }
  }

  console.log('Seed complete. Demo logins:');
  console.log('  admin@worksync.com / admin123');
  console.log('  employee@worksync.com / emp123');
} else {
  console.log('Database already has data — skipping seed. Run with --reset to wipe and reseed.');
}

module.exports = db;
