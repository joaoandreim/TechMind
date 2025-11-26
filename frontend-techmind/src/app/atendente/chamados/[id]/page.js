'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, Typography, Box, Button, Card, CardContent, 
  Chip, TextField, CircularProgress, Avatar, Stack, Grid, Divider 
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import LockIcon from '@mui/icons-material/Lock';
import api from '../../../../lib/api';
import { useToast } from '../../../../components/Ui/ToastProvider';
import useAuth from '../../../../hooks/authContext';

export default function AtendimentoPage({ params }) {
  const { id } = use(params);
  const [chamado, setChamado] = useState(null);
  const [respostas, setRespostas] = useState([]);
  const [novaResposta, setNovaResposta] = useState('');
  const [loading, setLoading] = useState(true);
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
    } catch (error) { show('Erro ao carregar.', 'error'); } finally { setLoading(false); }
  };

  useEffect(() => { carregarDados(); }, [id]);

  const handleResposta = async () => {
    if (!novaResposta.trim()) return;
    try {
      await api.post('/solucao-proposta', {
        descricao: novaResposta,
        chamadoId: Number(id),
        usuarioId: user.id
      });
      setNovaResposta('');
      show('Resposta enviada.', 'success');
      carregarDados();
    } catch (error) {
      const msg = error.response?.data?.message || 'Erro ao enviar.';
      show(msg, 'error');
    }
  };

  const alterarStatus = async (novoStatus) => {
    try {
      await api.put(`/chamado/${id}`, { status: novoStatus });
      show(`Status alterado para: ${novoStatus}`, 'success');
      carregarDados(); 
    } catch (error) { show('Erro.', 'error'); }
  };

  const getSolicitanteName = () => chamado?.usuarioChamados?.[0]?.usuario?.nome || 'Desconhecido';

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  
  const isClosed = chamado.status === 'Fechado';

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button onClick={() => router.back()} sx={{ mb: 2 }}>&larr; Voltar</Button>

      <Card sx={{ mb: 3, border: '1px solid #ccc', bgcolor: '#fafafa' }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6">Ações:</Typography>
          <Stack direction="row" spacing={2}>
            {chamado.status === 'Aberto' && (
              <Button variant="contained" color="warning" onClick={() => alterarStatus('Em Andamento')}>Assumir</Button>
            )}
            {!isClosed && (
              <Button variant="contained" color="success" onClick={() => alterarStatus('Fechado')}>Finalizar</Button>
            )}
            {isClosed && (
              <Button variant="outlined" onClick={() => alterarStatus('Em Andamento')}>Reabrir Chamado</Button>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Card elevation={3} sx={{ mb: 4, borderLeft: '6px solid #d32f2f' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{chamado.titulo}</Typography>
            <Chip label={chamado.status} color={isClosed ? 'success' : 'warning'} />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <PersonIcon />
                <Typography variant="body2">Solicitante: <strong>{getSolicitanteName()}</strong></Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <CategoryIcon />
                <Typography variant="body2">Categoria: <strong>{chamado.categoria?.nome || 'Geral'}</strong></Typography>
              </Box>
            </Grid>
          </Grid>
          <Typography variant="body1" sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>{chamado.descricao}</Typography>
        </CardContent>
      </Card>

      <Typography variant="h6" sx={{ mb: 2 }}>Histórico</Typography>
      <Box sx={{ mb: 4 }}>
        {respostas.map((resp) => (
          <Card key={resp.id} sx={{ mb: 2, bgcolor: resp.usuario?.id === user.id ? '#fff3e0' : '#fff', ml: resp.usuario?.id === user.id ? 4 : 0, mr: resp.usuario?.id === user.id ? 0 : 4 }}>
            <CardContent sx={{ py: 1, px: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#555' }}>
                {resp.usuario?.nome} <span style={{ fontWeight: 'normal', fontSize: '0.8em' }}>({new Date(resp.data).toLocaleString()})</span>
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>{resp.descricao}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Card variant="outlined" sx={{ bgcolor: isClosed ? '#f5f5f5' : 'white' }}>
        <CardContent>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
             <Typography variant="subtitle2" gutterBottom>{isClosed ? 'Chamado Encerrado' : 'Adicionar Resposta'}</Typography>
             {isClosed && <LockIcon fontSize="small" color="action" />}
           </Box>
          <TextField
            fullWidth multiline rows={3}
            placeholder={isClosed ? "Este chamado foi fechado. Para responder, é necessário reabri-lo." : "Escreva uma resposta técnica..."}
            value={novaResposta} onChange={(e) => setNovaResposta(e.target.value)}
            disabled={isClosed}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" onClick={handleResposta} disabled={isClosed}>Enviar Resposta</Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}