'use client';
import useSWR from 'swr';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ChamadoCard from '../../components/chamados/ChamadoCard';
import { getChamados } from '../../services/chamadoService';
import Link from 'next/link';

const fetcher = () => getChamados();

export default function ChamadosPage() {
  const { data: chamados, error } = useSWR('chamados', fetcher);

  if (error) return <Container>Erro ao carregar chamados</Container>;
  if (!chamados) return <Container>Carregando...</Container>;

  return (
    <Container>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4">Chamados</Typography>
        <Button component={Link} href="/chamados/novo" variant="contained">
          Novo Chamado
        </Button>
      </Stack>
      {chamados.map((c) => (
        <ChamadoCard key={c.id} chamado={c} />
      ))}
    </Container>
  );
}