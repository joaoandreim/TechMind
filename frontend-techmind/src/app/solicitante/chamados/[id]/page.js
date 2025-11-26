'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, Typography, Box, Button, Card, CardContent, 
  Chip, Divider, TextField, CircularProgress, Avatar, Grid 
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import LockIcon from '@mui/icons-material/Lock'; // Ícone de cadeado
import api from '../../../../lib/api';
import { useToast } from '../../../../components/Ui/ToastProvider';
import useAuth from '../../../../hooks/authContext';

export default function DetalhesChamadoPage({ params }) {
  const { id } = use(params); 

  const [chamado, setChamado] = useState(null);
  const [respostas, setRespostas] = useState([]);
  const [novaResposta, setNovaResposta] = useState('');
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  
  const { user } = useAuth();
  const router = useRouter();
  const { show } = useToast();

  const carregarDados = async () => {
    try {
      const resChamado = await api.get(`/chamado/${id}`);
      setChamado(resChamado.data);
      try {
        const resRespostas = await api.get(`/solucao-proposta/chamado/${id}`);
        setRespostas(resRespostas.data);
      } catch (e) { setRespostas([]); }
    } catch (error) {
      show('Erro ao carregar detalhes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregarDados(); }, [id]);

  const handleEnviarResposta = async () => {
    if (!novaResposta.trim()) return;
    setEnviando(true);
    try {
      await api.post('/solucao-proposta', {
        descricao: novaResposta,
        chamadoId: Number(id),
        usuarioId: user.id
      });
      setNovaResposta('');
      show('Mensagem enviada!', 'success');
      carregarDados(); 
    } catch (error) {
      const msg = error.response?.data?.message || 'Erro ao enviar mensagem.';
      show(msg, 'error');
    } finally {
      setEnviando(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'aberto': return 'success';
      case 'em andamento': return 'warning';
      case 'fechado': return 'default';
      default: return 'primary';
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (!chamado) return <Typography sx={{ mt: 10, textAlign: 'center' }}>Chamado não encontrado.</Typography>;

  // Verifica se está fechado
  const isClosed = chamado.status === 'Fechado';

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button onClick={() => router.back()} sx={{ mb: 2 }}>&larr; Voltar</Button>

      <Card elevation={3} sx={{ mb: 4, borderLeft: '6px solid #1976d2' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{chamado.titulo}</Typography>
            <Chip label={chamado.status} color={getStatusColor(chamado.status)} sx={{ fontWeight: 'bold' }} />
          </Box>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
             <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                   <PersonIcon fontSize="small" />
                   <Typography variant="body2">Solicitante: <strong>{chamado.usuarioChamados?.[0]?.usuario?.nome || 'Eu'}</strong></Typography>
                </Box>
             </Grid>
             <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                   <CategoryIcon fontSize="small" />
                   <Typography variant="body2">Categoria: <strong>{chamado.categoria?.nome || 'Geral'}</strong></Typography>
                </Box>
             </Grid>
          </Grid>
          
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{chamado.descricao}</Typography>
        </CardContent>
      </Card>

      <Typography variant="h6" sx={{ mb: 2 }}>Interações</Typography>
      <Box sx={{ mb: 4 }}>
        {respostas.map((resp) => (
          <Card key={resp.id} sx={{ mb: 2, bgcolor: resp.usuario?.id === user.id ? '#e3f2fd' : '#ffffff', ml: resp.usuario?.id === user.id ? 4 : 0, mr: resp.usuario?.id === user.id ? 0 : 4 }}>
            <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem', bgcolor: resp.usuario?.id === user.id ? 'primary.main' : 'secondary.main' }}>
                  {resp.usuario?.nome?.[0] || 'U'}
                </Avatar>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{resp.usuario?.nome}</Typography>
                <Typography variant="caption" color="text.secondary">• {new Date(resp.data).toLocaleString()}</Typography>
              </Box>
              <Typography variant="body2">{resp.descricao}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* CAMPO DE MENSAGEM (Com Bloqueio Visual) */}
      <Card variant="outlined" sx={{ bgcolor: isClosed ? '#f5f5f5' : 'white' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              {isClosed ? 'Tópico Encerrado' : 'Adicionar Comentário'}
            </Typography>
            {isClosed && <LockIcon fontSize="small" color="action" />}
          </Box>
          
          <TextField
            fullWidth
            multiline
            rows={3}
            // 🔑 Lógica de UX: Placeholder explica o motivo
            placeholder={isClosed ? "Este chamado foi fechado. Não é possível enviar novas mensagens." : "Escreva aqui..."}
            value={novaResposta}
            onChange={(e) => setNovaResposta(e.target.value)}
            // 🔒 Bloqueio do input
            disabled={enviando || isClosed}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="contained" 
              onClick={handleEnviarResposta} 
              // 🔒 Bloqueio do botão
              disabled={enviando || !novaResposta.trim() || isClosed}
            >
              {enviando ? 'Enviando...' : 'Enviar'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}