'use client';

import { Button, Typography, Container } from '@mui/material';

export default function Home() {
  return (
    <Container sx={{ mt: 5, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Bem-vindo ao TechMind 🚀
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Sistema de gerenciamento de chamados.
      </Typography>
      <Button variant="contained" color="primary">
        Criar novo chamado
      </Button>
    </Container>
  );
}
