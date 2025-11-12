import api from '../lib/api';

export const getChamados = async (params = {}) => {
  const res = await api.get('/chamados', { params });
  return res.data;
};

export const getChamadoById = async (id) => {
  const res = await api.get(`/chamados/${id}`);
  return res.data;
};

export const createChamado = async (payload) => {
  const res = await api.post('/chamados', payload);
  return res.data;
};

export const updateChamado = async (id, payload) => {
  const res = await api.put(`/chamados/${id}`, payload);
  return res.data;
};

export const deleteChamado = async (id) => {
  const res = await api.delete(`/chamados/${id}`);
  return res.data;
};