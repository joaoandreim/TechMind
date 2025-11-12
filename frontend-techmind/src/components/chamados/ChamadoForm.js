'use client';

import { useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

export default function ChamadoForm({ initialValues = {}, onSubmit }) {
  const { register, handleSubmit, formState } = useForm({ defaultValues: initialValues });
  const { isSubmitting } = formState;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Criar / Editar Chamado
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: '1fr',
              maxWidth: 600,
            }}
          >
            <TextField
              label="Título"
              fullWidth
              {...register('titulo', { required: true })}
            />
            <TextField
              label="Descrição"
              fullWidth
              multiline
              rows={6}
              {...register('descricao')}
            />
            <TextField
              label="Categoria (id)"
              fullWidth
              {...register('categoriaId')}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{ mt: 2 }}
            >
              Salvar
            </Button>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
}
