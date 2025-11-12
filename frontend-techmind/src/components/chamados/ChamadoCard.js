import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';

export default function ChamadoCard({ chamado }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{chamado.titulo}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {chamado.descricao}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Categoria: {chamado.categoria?.nome || '—'} • Status: {chamado.status || '—'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" component={Link} href={`/chamados/${chamado.id}`}>
          Ver
        </Button>
      </CardActions>
    </Card>
  );
}