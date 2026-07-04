const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const MOCK_EMPLOYEES = [
  { id: 1, name: 'Alex Johnson',    email: 'alex.johnson@worksync.com',    phone: '+1 555-0101', department: 'Management',   position: 'HR Manager',          salary: 95000, status: 'active',   joinDate: '2021-01-15', gender: 'Male',   avatar: null },
  { id: 2, name: 'Sarah Connor',    email: 'sarah.connor@worksync.com',    phone: '+1 555-0102', department: 'Engineering',  position: 'Software Engineer',   salary: 85000, status: 'active',   joinDate: '2022-06-01', gender: 'Female', avatar: null },
  { id: 3, name: 'Marcus Rivera',   email: 'marcus.rivera@worksync.com',   phone: '+1 555-0103', department: 'Engineering',  position: 'Senior Engineer',     salary: 105000, status: 'active',  joinDate: '2020-03-10', gender: 'Male',   avatar: null },
  { id: 4, name: 'Priya Patel',     email: 'priya.patel@worksync.com',     phone: '+1 555-0104', department: 'Design',       position: 'UX Designer',         salary: 78000, status: 'active',   joinDate: '2023-02-14', gender: 'Female', avatar: null },
  { id: 5, name: 'James Wu',        email: 'james.wu@worksync.com',        phone: '+1 555-0105', department: 'Sales',        position: 'Sales Executive',     salary: 72000, status: 'active',   joinDate: '2021-09-20', gender: 'Male',   avatar: null },
  { id: 6, name: 'Emma Davis',      email: 'emma.davis@worksync.com',      phone: '+1 555-0106', department: 'Finance',      position: 'Financial Analyst',   salary: 88000, status: 'active',   joinDate: '2022-11-30', gender: 'Female', avatar: null },
  { id: 7, name: 'Liam Thompson',   email: 'liam.thompson@worksync.com',   phone: '+1 555-0107', department: 'Marketing',   position: 'Marketing Specialist', salary: 68000, status: 'inactive', joinDate: '2023-05-01', gender: 'Male',   avatar: null },
  { id: 8, name: 'Olivia Martinez', email: 'olivia.martinez@worksync.com', phone: '+1 555-0108', department: 'Engineering',  position: 'QA Engineer',         salary: 75000, status: 'active',   joinDate: '2022-08-15', gender: 'Female', avatar: null },
  { id: 9, name: 'Noah Wilson',     email: 'noah.wilson@worksync.com',     phone: '+1 555-0109', department: 'Sales',        position: 'Account Manager',     salary: 80000, status: 'active',   joinDate: '2021-12-01', gender: 'Male',   avatar: null },
  { id: 10, name: 'Ava Brown',      email: 'ava.brown@worksync.com',       phone: '+1 555-0110', department: 'Design',       position: 'Graphic Designer',    salary: 65000, status: 'active',   joinDate: '2023-07-10', gender: 'Female', avatar: null },
];

let employees = [...MOCK_EMPLOYEES];

export const employeeAPI = {
  getAll: async (params = {}) => {
    await delay(400);
    let data = [...employees];
    if (params.search) {
      const q = params.search.toLowerCase();
      data = data.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.position.toLowerCase().includes(q)
      );
    }
    if (params.department && params.department !== 'all') {
      data = data.filter(e => e.department === params.department);
    }
    if (params.status && params.status !== 'all') {
      data = data.filter(e => e.status === params.status);
    }
    return { data, total: data.length };
  },

  getById: async (id) => {
    await delay(300);
    const emp = employees.find(e => e.id === Number(id));
    if (!emp) throw new Error('Employee not found');
    return emp;
  },

  create: async (data) => {
    await delay(600);
    const newEmp = { ...data, id: employees.length + 10, avatar: null };
    employees.push(newEmp);
    return newEmp;
  },

  update: async (id, data) => {
    await delay(500);
    const idx = employees.findIndex(e => e.id === Number(id));
    if (idx === -1) throw new Error('Employee not found');
    employees[idx] = { ...employees[idx], ...data };
    return employees[idx];
  },

  delete: async (id) => {
    await delay(400);
    employees = employees.filter(e => e.id !== Number(id));
    return { success: true };
  },

  getDepartments: async () => {
    await delay(100);
    return [...new Set(employees.map(e => e.department))];
  },
};
