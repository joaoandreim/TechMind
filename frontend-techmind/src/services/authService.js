import api from '../lib/api';

export const loginRequest = async (payload) => {
  const res = await api.post('/auth/login', payload);
  return res.data;
};

export const me = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};