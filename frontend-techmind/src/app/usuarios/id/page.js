'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';

export default function UsuarioDetalhesPage() {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchUsuario() {
      try {
        const res = await fetch(`/api/usuarios/${id}`);
        if (!res.ok) throw new Error('Erro ao buscar usuário');
        const data = await res.json();
        setUsuario(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsuario();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!usuario) {
    return (
      <Container>
        <Typography variant="h6">Usuário não encontrado.</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Detalhes do Usuário
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography>ID: {usuario.id}</Typography>
        <Typography>Nome: {usuario.nome}</Typography>
        <Typography>Email: {usuario.email}</Typography>
      </Paper>
    </Container>
  );
}