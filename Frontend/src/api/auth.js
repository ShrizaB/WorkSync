import api from './axios';

export const authAPI = {
  login: async ({ email, password }) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data; // { token, user }
  },

  register: async (data) => {
    const { data: res } = await api.post('/auth/register', data);
    return res; // { token, user }
  },

  getProfile: async () => {
    const { data } = await api.get('/auth/profile');
    return data;
  },
};
