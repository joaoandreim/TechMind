'use client';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';

export default function CategoriasPage() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Categorias
      </Typography>

      <Typography>
        Aqui você poderá listar, criar e gerenciar as categorias do sistema.
      </Typography>

      <Link href="/categorias/nova" passHref>
        <Button variant="contained" sx={{ mt: 2 }}>
          Nova Categoria
        </Button>
      </Link>
    </Container>
  );
}