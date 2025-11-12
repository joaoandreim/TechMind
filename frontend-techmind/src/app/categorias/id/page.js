'use client';
import { useParams } from 'next/navigation';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function CategoriaPage() {
  const params = useParams();
  const { id } = params;

  return (
    <Container>
      <Typography variant="h4">Categoria {id}</Typography>
      <Typography>Detalhes da categoria aqui...</Typography>
    </Container>
  );
}