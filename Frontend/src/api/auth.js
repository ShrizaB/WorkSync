// Mock Auth API — simulates JWT auth responses
const DEMO_USERS = [
  {
    id: 1,
    name: 'Alex Johnson',
    email: 'admin@worksync.com',
    password: 'admin123',
    role: 'admin',
    department: 'Management',
    position: 'HR Manager',
    avatar: null,
    phone: '+1 (555) 000-0001',
    joinDate: '2021-01-15',
  },
  {
    id: 2,
    name: 'Sarah Connor',
    email: 'employee@worksync.com',
    password: 'emp123',
    role: 'employee',
    department: 'Engineering',
    position: 'Software Engineer',
    avatar: null,
    phone: '+1 (555) 000-0002',
    joinDate: '2022-06-01',
  },
];

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const authAPI = {
  login: async ({ email, password }) => {
    await delay(600);
    const user = DEMO_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) throw new Error('Invalid email or password');
    const { password: _, ...safeUser } = user;
    const token = btoa(JSON.stringify({ id: user.id, role: user.role, exp: Date.now() + 86400000 }));
    return { token, user: safeUser };
  },

  register: async (data) => {
    await delay(800);
    const exists = DEMO_USERS.find((u) => u.email === data.email);
    if (exists) throw new Error('Email already in use');
    const newUser = {
      id: DEMO_USERS.length + 1,
      ...data,
      avatar: null,
      joinDate: new Date().toISOString().split('T')[0],
    };
    const { password: _, ...safeUser } = newUser;
    const token = btoa(JSON.stringify({ id: newUser.id, role: newUser.role, exp: Date.now() + 86400000 }));
    return { token, user: safeUser };
  },

  getProfile: async () => {
    await delay(300);
    const raw = localStorage.getItem('hrm_user');
    if (!raw) throw new Error('Not authenticated');
    return JSON.parse(raw);
  },
};
