import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

export default function DashboardPage() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid
        container
        spacing={2}
        columns={{ xs: 12, md: 12 }}
        sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}
      >
        <Grid>
          <Paper sx={{ p: 2 }}>Chamados Abertos: —</Paper>
        </Grid>
        <Grid>
          <Paper sx={{ p: 2 }}>Em andamento: —</Paper>
        </Grid>
        <Grid>
          <Paper sx={{ p: 2 }}>Fechados hoje: —</Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
