'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, Typography, Box, Card, Chip, CircularProgress, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip,
  TextField, InputAdornment, Select, MenuItem, FormControl, Button
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import api from '../../../lib/api';
import { useToast } from '../../../components/Ui/ToastProvider';

export default function AdminChamadosPage() {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('todos');
  const router = useRouter();
  const { show } = useToast();

  const fetchChamados = async () => {
    setLoading(true);
    try {
      const response = await api.get('/chamado');
      const ordenados = response.data.sort((a, b) => {
        const peso = { 'Aberto': 1, 'Em Andamento': 2, 'Fechado': 3 };
        const statusDiff = (peso[a.status] || 4) - (peso[b.status] || 4);
        if (statusDiff !== 0) return statusDiff;
        return b.id - a.id;
      });
      setChamados(ordenados);
    } catch (error) {
      show('Erro ao carregar lista.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchChamados(); }, []);

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
    return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const getSolicitanteName = (chamado) => chamado.usuarioChamados?.[0]?.usuario?.nome || '-';

  const chamadosFiltrados = chamados.filter(c => {
    const termo = busca.toLowerCase();
    const matchTexto = c.titulo.toLowerCase().includes(termo) || String(c.id).includes(termo) || getSolicitanteName(c).toLowerCase().includes(termo);
    const matchStatus = statusFiltro === 'todos' || c.status === statusFiltro;
    return matchTexto && matchStatus;
  });

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Button onClick={() => router.back()} sx={{ mb: 1, p: 0, minWidth: 0, justifyContent: 'flex-start' }}>
            &larr; Voltar
          </Button>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a202c' }}>
            Supervisão de Chamados
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField 
            size="small" placeholder="Buscar..." value={busca} onChange={e => setBusca(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> }}
            sx={{ bgcolor: 'white' }}
          />
          <FormControl size="small" sx={{ minWidth: 120, bgcolor: 'white' }}>
            <Select value={statusFiltro} onChange={e => setStatusFiltro(e.target.value)} displayEmpty
              startAdornment={<InputAdornment position="start"><FilterListIcon color="action" fontSize="small" /></InputAdornment>}
            >
              <MenuItem value="todos">Todos os Status</MenuItem>
              <MenuItem value="Aberto">Aberto</MenuItem>
              <MenuItem value="Em Andamento">Em Andamento</MenuItem>
              <MenuItem value="Fechado">Fechado</MenuItem>
            </Select>
          </FormControl>
          <IconButton onClick={fetchChamados} color="primary" sx={{ bgcolor: 'white' }}><RefreshIcon /></IconButton>
        </Box>
      </Box>
      

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>
      ) : chamadosFiltrados.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center', bgcolor: '#f8f9fa' }}><Typography color="text.secondary">Nenhum chamado encontrado.</Typography></Card>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead sx={{ bgcolor: '#f7fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#4a5568' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#4a5568' }}>Solicitante</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#4a5568' }}>Título</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#4a5568' }}>Categoria</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#4a5568' }}>Aberto em</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', color: '#4a5568' }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: '#4a5568' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chamadosFiltrados.map((chamado) => (
                <TableRow 
                  key={chamado.id} hover
                  sx={{ cursor: 'pointer', borderLeft: chamado.status === 'Aberto' ? '4px solid #e53e3e' : '4px solid transparent' }}
                  onClick={() => router.push(`/admin/chamados/${chamado.id}`)}
                >
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>#{chamado.id}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{getSolicitanteName(chamado)}</TableCell>
                  <TableCell sx={{ maxWidth: 250, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <Tooltip title={chamado.titulo} placement="top-start"><span>{chamado.titulo}</span></Tooltip>
                  </TableCell>
                  <TableCell><Chip label={chamado.categoria?.nome || 'Geral'} size="small" variant="outlined" sx={{ borderColor: '#cbd5e0' }} /></TableCell>
                  <TableCell>{formatDate(chamado.dataAbertura)}</TableCell>
                  <TableCell align="center">
                    <Chip label={chamado.status} color={getStatusColor(chamado.status)} size="small" sx={{ fontWeight: 600, minWidth: 80 }} />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Visualizar">
                      <IconButton size="small" sx={{ color: '#3182ce' }} onClick={(e) => { e.stopPropagation(); router.push(`/admin/chamados/${chamado.id}`); }}>
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