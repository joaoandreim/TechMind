'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, Typography, Box, Button, Card, CardContent, 
  Chip, TextField, CircularProgress, Avatar, Stack, Divider 
} from '@mui/material';
import api from '../../../../lib/api';
import { useToast } from '../../../../components/Ui/ToastProvider';
import useAuth from '../../../../hooks/authContext';

export default function AdminChamadoDetalhesPage({ params }) {
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
    } catch (error) {
      show('Erro ao carregar chamado.', 'error');
    } finally {
      setLoading(false);
    }
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
      show('Mensagem de admin enviada.', 'success');
      carregarDados();
    } catch (error) { show('Erro ao enviar.', 'error'); }
  };

  const alterarStatus = async (novoStatus) => {
    try {
      await api.put(`/chamado/${id}`, { status: novoStatus });
      show(`Status alterado para: ${novoStatus}`, 'success');
      carregarDados();
    } catch (error) { show('Erro ao atualizar status.', 'error'); }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (!chamado) return <Typography sx={{ mt: 10, textAlign: 'center' }}>Chamado não encontrado.</Typography>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button onClick={() => router.back()} sx={{ mb: 2 }}>&larr; Voltar</Button>

      {/* CARTÃO DE AÇÕES ADMINISTRATIVAS */}
      <Card sx={{ mb: 3, border: '1px solid #a5d6a7', bgcolor: '#e8f5e9' }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
            Supervisão:
          </Typography>
          <Stack direction="row" spacing={2}>
            {chamado.status === 'Aberto' && (
              <Button variant="contained" color="warning" onClick={() => alterarStatus('Em Andamento')}>
                Forçar Início
              </Button>
            )}
            {chamado.status !== 'Fechado' && (
              <Button variant="contained" color="success" onClick={() => alterarStatus('Fechado')}>
                Fechar Chamado
              </Button>
            )}
            {chamado.status === 'Fechado' && (
              <Button variant="outlined" color="warning" onClick={() => alterarStatus('Em Andamento')}>
                Reabrir
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* DETALHES DO CHAMADO */}
      <Card elevation={3} sx={{ mb: 4, borderLeft: '6px solid #2e7d32' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{chamado.titulo}</Typography>
            <Chip label={chamado.status} color={chamado.status === 'Fechado' ? 'success' : 'warning'} />
          </Box>
          
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
             Categoria: {chamado.categoria?.nome} • Solicitante: {chamado.usuario?.nome || 'N/A'}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1">{chamado.descricao}</Typography>
        </CardContent>
      </Card>

      {/* HISTÓRICO */}
      <Typography variant="h6" sx={{ mb: 2, color: '#2e7d32' }}>Histórico de Interações</Typography>
      <Box sx={{ mb: 4 }}>
        {respostas.length === 0 && <Typography color="text.secondary">Sem interações.</Typography>}
        {respostas.map((resp) => (
          <Card key={resp.id} sx={{ mb: 2, bgcolor: resp.usuario?.id === user.id ? '#f1f8e9' : '#fff', ml: resp.usuario?.id === user.id ? 4 : 0, mr: resp.usuario?.id === user.id ? 0 : 4 }}>
            <CardContent sx={{ py: 1, px: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: resp.usuario?.tipoUsuario?.nome === 'administrador' ? '#2e7d32' : '#555' }}>
                {resp.usuario?.nome} <span style={{ fontSize: '0.8em', fontWeight: 'normal' }}>({new Date(resp.data).toLocaleString()})</span>
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>{resp.descricao}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* CAMPO DE RESPOSTA */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>Adicionar Nota Administrativa / Resposta</Typography>
          <TextField
            fullWidth multiline rows={3} placeholder="Escreva uma observação..."
            value={novaResposta} onChange={(e) => setNovaResposta(e.target.value)}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" color="success" onClick={handleResposta}>Enviar</Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}