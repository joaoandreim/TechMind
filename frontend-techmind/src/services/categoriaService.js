import api from '../lib/api';

export const getCategorias = async () => {
  const res = await api.get('/categorias');
  return res.data;
};

export const createCategoria = async (payload) => {
  const res = await api.post('/categorias', payload);
  return res.data;
};

export const updateCategoria = async (id, payload) => {
  const res = await api.put(`/categorias/${id}`, payload);
  return res.data;
};

export const deleteCategoria = async (id) => {
  const res = await api.delete(`/categorias/${id}`);
  return res.data;
};