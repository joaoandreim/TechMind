'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, Card, CardContent, Typography, TextField, Button, 
  CircularProgress, FormControl, InputLabel, Select, MenuItem, Box 
} from '@mui/material';
import api from '../../../../lib/api';
import { useToast } from '../../../../components/Ui/ToastProvider';
import useAuth from '../../../../hooks/authContext';

export default function NovoChamadoAtendentePage() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [categorias, setCategorias] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { show } = useToast();

  useEffect(() => {
    async function loadCategorias() {
      try {
        const response = await api.get('/categoria');
        setCategorias(response.data);
      } catch (error) {
        console.error('Erro ao carregar categorias', error);
        show('Erro ao carregar categorias.', 'error');
      }
    }
    loadCategorias();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!user || !user.id) {
      show('Erro de autenticação.', 'error');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        titulo,
        descricao,
        status: 'Aberto',
        categoria: { id: Number(categoriaId) },
        usuarioId: user.id
      };

      await api.post('/chamado', payload);

      show('Chamado criado com sucesso!', 'success');
      router.push('/atendente/dashboard');
    } catch (err) {
      console.error(err);
      show('Erro ao criar chamado.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Button onClick={() => router.back()} sx={{ mb: 2 }}>
          Voltar
        </Button>
        
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Abrir Chamado Interno
            </Typography>

            <form onSubmit={onSubmit}>
              <TextField
                label="Título"
                fullWidth
                margin="normal"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                disabled={loading}
              />

              <FormControl fullWidth margin="normal" required>
                <InputLabel id="cat-label">Categoria</InputLabel>
                <Select
                  labelId="cat-label"
                  value={categoriaId}
                  label="Categoria"
                  onChange={(e) => setCategoriaId(e.target.value)}
                  disabled={loading}
                >
                  {categorias.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Descrição"
                fullWidth
                margin="normal"
                required
                multiline
                rows={4}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                disabled={loading}
              />

              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button variant="outlined" onClick={() => router.back()} disabled={loading}>
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" fullWidth disabled={loading}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Criar Chamado'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}