import api from './axios';

export const aiAPI = {
  // history: [{ role: 'user' | 'assistant', text: string }]
  ask: async (message, history = []) => {
    const { data } = await api.post('/ai/assistant', { message, history });
    return data; // { reply }
  },

  improveLeaveReason: async (draft) => {
    const { data } = await api.post('/ai/leave-reason-helper', { draft });
    return data; // { suggestion }
  },
};
