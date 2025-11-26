'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, Typography, Box, Button, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, IconButton, 
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, InputAdornment, Collapse, Chip, Avatar, Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PersonIcon from '@mui/icons-material/Person';

import api from '../../../lib/api';
import { useToast } from '../../../components/Ui/ToastProvider';

function Row({ row, onDelete }) {
  const [open, setOpen] = useState(false);
  const atendentes = row.usuarios || [];

  return (
    <>
      <TableRow hover sx={{ '& > *': { borderBottom: 'unset' }, cursor: 'pointer' }} onClick={() => setOpen(!open)}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={(e) => { e.stopPropagation(); setOpen(!open); }}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ fontWeight: 'bold' }}>#{row.id}</TableCell>
        <TableCell sx={{ fontWeight: 500, fontSize: '1rem' }}>{row.nome}</TableCell>
        <TableCell align="center">
          <Chip 
            label={`${atendentes.length} atendentes`} 
            color={atendentes.length > 0 ? 'primary' : 'default'} 
            variant="outlined" 
            size="small" 
          />
        </TableCell>
        <TableCell align="right">
          <IconButton color="error" onClick={(e) => { e.stopPropagation(); onDelete(row.id); }} title="Remover Categoria">
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, p: 2, bgcolor: '#f9f9f9', borderRadius: 2, borderLeft: '4px solid #1976d2' }}>
              <Typography variant="subtitle2" gutterBottom component="div" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon fontSize="small" /> Equipe de Atendimento ({row.nome})
              </Typography>
              
              {atendentes.length === 0 ? (
                <Typography variant="caption" fontStyle="italic" sx={{ ml: 3 }}>Nenhum atendente vinculado a este setor.</Typography>
              ) : (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1, ml: 3 }}>
                  {atendentes.map((user) => (
                    <Chip 
                      key={user.id} 
                      avatar={<Avatar sx={{ width: 24, height: 24 }}>{user.nome[0]}</Avatar>} 
                      label={user.nome} 
                      variant="outlined"
                      sx={{ bgcolor: 'white', border: '1px solid #e0e0e0' }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function GerenciarCategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  
  const [openDialog, setOpenDialog] = useState(false);
  const [novaCategoria, setNovaCategoria] = useState('');
  const [saving, setSaving] = useState(false);

  const router = useRouter();
  const { show } = useToast();

  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const response = await api.get('/categoria');
      setCategorias(response.data.sort((a, b) => a.id - b.id));
    } catch (error) {
      show('Erro ao carregar categorias.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategorias(); }, []);

  const handleAdd = async (e) => {
    if (e) e.preventDefault();
    if (!novaCategoria.trim()) return;
    
    setSaving(true);
    try {
      await api.post('/categoria', { nome: novaCategoria });
      show('Categoria adicionada com sucesso!', 'success');
      setNovaCategoria('');
      setOpenDialog(false);
      fetchCategorias();
    } catch (error) {
      show('Erro ao criar. Talvez o nome já exista.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza? Isso pode afetar chamados existentes.')) return;
    try {
      await api.delete(`/categoria/${id}`);
      show('Categoria removida.', 'success');
      fetchCategorias();
    } catch (error) {
      show('Erro ao remover. Categoria provavelmente em uso.', 'error');
    }
  };

  const categoriasFiltradas = categorias.filter(cat => 
    cat.nome.toLowerCase().includes(busca.toLowerCase()) || String(cat.id).includes(busca)
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Button onClick={() => router.back()} sx={{ mb: 1, p: 0, minWidth: 0, justifyContent: 'flex-start' }}>
            &larr; Voltar
          </Button>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a202c' }}>
            Gerenciar Categorias
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField 
            size="small" 
            placeholder="Buscar..." 
            value={busca} 
            onChange={(e) => setBusca(e.target.value)}
            InputProps={{ 
              startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> 
            }}
            sx={{ bgcolor: 'white', minWidth: 200 }}
          />
          
          <Tooltip title="Atualizar Lista">
            <IconButton onClick={fetchCategorias} color="primary" sx={{ bgcolor: 'white', border: '1px solid #e0e0e0' }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Button 
            variant="contained" 
            color="success"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{ bgcolor: '#00b65e', '&:hover': { bgcolor: '#00944d' }, whiteSpace: 'nowrap' }}
          >
            Nova Categoria
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f7fafc' }}>
              <TableRow>
                <TableCell width="50px" />
                <TableCell sx={{ fontWeight: 'bold', color: '#4a5568', width: '100px' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#4a5568' }}>Nome</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', color: '#4a5568' }}>Equipe</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: '#4a5568' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categoriasFiltradas.length === 0 ? (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>Nenhuma categoria encontrada.</TableCell></TableRow>
              ) : (
                categoriasFiltradas.map((cat) => (
                  <Row key={cat.id} row={cat} onDelete={handleDelete} />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* MODAL DE ADIÇÃO */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #eee' }}>Nova Categoria</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField 
            autoFocus label="Nome" variant="outlined" fullWidth value={novaCategoria}
            onChange={(e) => setNovaCategoria(e.target.value)} placeholder="Ex: Infraestrutura..."
            onKeyPress={(e) => e.key === 'Enter' && handleAdd(e)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit">Cancelar</Button>
          <Button onClick={handleAdd} variant="contained" color="success" disabled={!novaCategoria.trim() || saving}>
            {saving ? <CircularProgress size={24} color="inherit" /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}