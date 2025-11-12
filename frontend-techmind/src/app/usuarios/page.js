'use client';

import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Link from 'next/link';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const res = await fetch('/api/usuarios');
        if (!res.ok) throw new Error('Erro ao buscar usuários');
        const data = await res.json();
        setUsuarios(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsuarios();
  }, []);

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 5 }}>
        <Typography>Carregando usuários...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Lista de Usuários
      </Typography>

      <Button
        variant="contained"
        color="primary"
        component={Link}
        href="/usuarios/novo"
        sx={{ mb: 2 }}
      >
        Novo Usuário
      </Button>

      <Grid container spacing={2}>
        {usuarios.map((usuario) => (
          <Grid item xs={12} md={6} key={usuario.id}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">{usuario.nome}</Typography>
              <Typography>{usuario.email}</Typography>
              <Button
                variant="outlined"
                href={`/usuarios/${usuario.id}`}
                sx={{ mt: 1 }}
              >
                Ver Detalhes
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}