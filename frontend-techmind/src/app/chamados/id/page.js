'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getChamadoById } from '../../../services/chamadoService';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export default function ChamadoDetail() {
  const params = useParams();
  const { id } = params;
  const [chamado, setChamado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getChamadoById(id)
      .then((data) => setChamado(data))
      .catch(() => setChamado(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Container>Carregando...</Container>;
  if (!chamado) return <Container>Chamado não encontrado</Container>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {chamado.titulo}
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1">{chamado.descricao}</Typography>
        <Typography variant="caption">Categoria: {chamado.categoria?.nome || '—'}</Typography>
      </Paper>
    </Container>
  );
}