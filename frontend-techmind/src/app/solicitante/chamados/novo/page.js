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

export default function NovoChamadoPage() {
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
        console.error('Erro ao buscar categorias:', error);
        show('Erro ao carregar categorias.', 'error');
      }
    }
    loadCategorias();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!user || !user.id) {
      show('Erro de autenticação. Faça login novamente.', 'error');
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

      show('Chamado aberto com sucesso!', 'success');
      router.push('/solicitante/dashboard');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Erro ao abrir chamado.';
      show(msg, 'error');
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
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
              Abrir Novo Chamado
            </Typography>

            <form onSubmit={onSubmit}>
              <TextField
                label="Título do Problema"
                fullWidth
                margin="normal"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                disabled={loading}
                placeholder="Ex: Monitor não liga"
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
                  {categorias.length > 0 ? (
                    categorias.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.nome}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      Carregando categorias...
                    </MenuItem>
                  )}
                </Select>
              </FormControl>

              <TextField
                label="Descrição Detalhada"
                fullWidth
                margin="normal"
                required
                multiline
                rows={5}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                disabled={loading}
                placeholder="Descreva o problema com o máximo de detalhes possível..."
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Enviar Chamado'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}