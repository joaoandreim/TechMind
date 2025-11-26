'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, Typography, Box, Button, Card, 
  Chip, CircularProgress, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import api from '../../../lib/api';
import { useToast } from '../../../components/Ui/ToastProvider';
import useAuth from '../../../hooks/authContext';

export default function MeusChamadosPage() {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const { show } = useToast();

  const fetchChamados = async () => {
    setLoading(true);
    try {
      const response = await api.get('/chamado');
      const meusChamados = response.data.filter(chamado => 
        chamado.usuarioChamados?.some(vinculo => vinculo.usuario?.id === user.id)
      );
      setChamados(meusChamados.sort((a, b) => b.id - a.id));
    } catch (error) {
      show('Erro ao carregar lista.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchChamados();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'aberto': return 'error';
      case 'em andamento': return 'warning';
      case 'fechado': return 'success';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* CABEÇALHO */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a202c' }}>
          Meus Chamados
        </Typography>
        <Box>
          <IconButton onClick={fetchChamados} color="primary" sx={{ mr: 1 }}>
            <RefreshIcon />
          </IconButton>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => router.push('/solicitante/chamados/novo')}
            sx={{ bgcolor: '#00b65e', '&:hover': { bgcolor: '#00944d' } }}
          >
            Novo Chamado
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>
      ) : chamados.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center', bgcolor: '#f8f9fa' }}>
          <Typography color="text.secondary">Você ainda não abriu nenhum chamado.</Typography>
        </Card>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="lista de chamados">
            <TableHead sx={{ bgcolor: '#f7fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#4a5568' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#4a5568' }}>Título</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#4a5568' }}>Categoria</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#4a5568' }}>Data de Abertura</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#4a5568' }} align="center">Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: '#4a5568' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chamados.map((chamado) => (
                <TableRow 
                  key={chamado.id}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                  onClick={() => router.push(`/solicitante/chamados/${chamado.id}`)}
                >
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                    #{chamado.id}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <Tooltip title={chamado.titulo} placement="top-start">
                      <span>{chamado.titulo}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Chip label={chamado.categoria?.nome || 'Geral'} size="small" variant="outlined" sx={{ borderColor: '#cbd5e0', color: '#4a5568' }} />
                  </TableCell>
                  <TableCell>{formatDate(chamado.dataAbertura)}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={chamado.status} 
                      color={getStatusColor(chamado.status)} 
                      size="small" 
                      sx={{ fontWeight: 600, minWidth: 80 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Ver Detalhes">
                      <IconButton 
                        size="small" 
                        sx={{ color: '#3182ce' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/solicitante/chamados/${chamado.id}`);
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}