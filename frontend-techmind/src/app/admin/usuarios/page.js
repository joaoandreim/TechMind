'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, Typography, Box, Button, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, 
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, 
  FormControl, InputLabel, Select, MenuItem, TextField, InputAdornment, 
  Tooltip, Avatar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import PeopleIcon from '@mui/icons-material/People';
import BadgeIcon from '@mui/icons-material/Badge';

import api from '../../../lib/api';
import { useToast } from '../../../components/Ui/ToastProvider';
import { TIPO_USUARIO } from '../../../lib/constants';

export default function GerenciarUsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [categorias, setCategorias] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [busca, setBusca] = useState('');
  const [filtroPerfil, setFiltroPerfil] = useState('todos');

  const [editOpen, setEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [saving, setSaving] = useState(false);

  const router = useRouter();
  const { show } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resUsers, resCats] = await Promise.all([
        api.get('/usuario'),
        api.get('/categoria')
      ]);
      
      setUsuarios(resUsers.data.sort((a, b) => a.id - b.id));
      setCategorias(resCats.data);
    } catch (error) {
      show('Erro ao carregar dados.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleEditClick = (user) => {
    setEditingUser(user);
    setSelectedRole(user.tipoUsuario?.id || TIPO_USUARIO.SOLICITANTE);
    setSelectedCategory(user.categoria?.id || ''); 
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      const payload = {
        tipoUsuario: { id: selectedRole },
        categoria: selectedRole === TIPO_USUARIO.ATENDENTE && selectedCategory ? { id: selectedCategory } : null
      };

      await api.put(`/usuario/${editingUser.id}`, payload);
      
      show('Usuário atualizado com sucesso!', 'success');
      setEditOpen(false);
      fetchData();
    } catch (error) {
      show('Erro ao atualizar usuário.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, nome) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${nome}"?`)) return;
    try {
      await api.delete(`/usuario/${id}`);
      show('Usuário removido.', 'success');
      fetchData();
    } catch (error) { show('Erro ao remover.', 'error'); }
  };

  const getRoleConfig = (user) => {
    const roleId = user.tipoUsuario?.id;
    const roleName = user.tipoUsuario?.nome || 'Desconhecido';

    if (roleId === TIPO_USUARIO.ADMINISTRADOR) return { color: 'error', label: 'ADMIN', variant: 'filled' };
    if (roleId === TIPO_USUARIO.ATENDENTE) return { color: 'warning', label: 'ATENDENTE', variant: 'filled' };
    return { color: 'primary', label: 'SOLICITANTE', variant: 'outlined' };
  };

  const usuariosFiltrados = usuarios.filter((user) => {
    const termo = busca.toLowerCase();
    const nomeMatch = user.nome.toLowerCase().includes(termo);
    const emailMatch = user.email.toLowerCase().includes(termo);
    
    const perfilMatch = filtroPerfil === 'todos' || String(user.tipoUsuario?.id) === String(filtroPerfil);

    return (nomeMatch || emailMatch) && perfilMatch;
  });

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* CABEÇALHO PADRONIZADO */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Button onClick={() => router.back()} sx={{ mb: 1, p: 0, minWidth: 0, justifyContent: 'flex-start' }}>
            &larr; Voltar
          </Button>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a202c' }}>
            Usuários
          </Typography>
        </Box>

        {/* BARRA DE AÇÕES UNIFICADA */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Campo de Busca */}
          <TextField 
            size="small" 
            placeholder="Buscar nome ou email..." 
            value={busca} 
            onChange={(e) => setBusca(e.target.value)}
            InputProps={{ 
              startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> 
            }}
            sx={{ bgcolor: 'white', minWidth: 220 }}
          />

          {/* Filtro de Perfil */}
          <FormControl size="small" sx={{ minWidth: 150, bgcolor: 'white' }}>
            <InputLabel>Filtrar Perfil</InputLabel>
            <Select 
              value={filtroPerfil} 
              label="Filtrar Perfil" 
              onChange={(e) => setFiltroPerfil(e.target.value)}
            >
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value={TIPO_USUARIO.SOLICITANTE}>Solicitantes</MenuItem>
              <MenuItem value={TIPO_USUARIO.ATENDENTE}>Atendentes</MenuItem>
              <MenuItem value={TIPO_USUARIO.ADMINISTRADOR}>Administradores</MenuItem>
            </Select>
          </FormControl>
          
          <Tooltip title="Atualizar Lista">
            <IconButton onClick={fetchData} color="primary" sx={{ bgcolor: 'white', border: '1px solid #e0e0e0' }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Button 
            variant="contained" 
            color="success" 
            startIcon={<AddIcon />}
            onClick={() => router.push('/cadastro_usuario')}
            sx={{ bgcolor: '#00b65e', '&:hover': { bgcolor: '#00944d' }, whiteSpace: 'nowrap' }}
          >
            Novo Usuário
          </Button>
        </Box>
      </Box>

      {/* TABELA */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead sx={{ bgcolor: '#f7fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#4a5568' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#4a5568' }}>Usuário</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#4a5568' }}>Perfil de Acesso</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#4a5568' }}>Setor (Atendente)</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: '#4a5568' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuariosFiltrados.length === 0 ? (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>Nenhum usuário encontrado.</TableCell></TableRow>
              ) : (
                usuariosFiltrados.map((user) => {
                  const roleConfig = getRoleConfig(user);
                  return (
                    <TableRow key={user.id} hover>
                      <TableCell sx={{ fontWeight: 'bold', color: '#555' }}>#{user.id}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: roleConfig.color + '.main', fontSize: '0.9rem' }}>
                            {user.nome[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>{user.nome}</Typography>
                            <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          icon={roleConfig.label === 'ADMIN' ? <BadgeIcon /> : undefined}
                          label={roleConfig.label} 
                          color={roleConfig.color} 
                          variant={roleConfig.variant}
                          size="small" 
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                      <TableCell>
                        {user.tipoUsuario?.id === TIPO_USUARIO.ATENDENTE ? (
                          <Chip label={user.categoria?.nome || 'Sem Setor'} size="small" variant="outlined" sx={{ borderColor: '#e0e0e0' }} />
                        ) : (
                          <Typography variant="caption" color="text.disabled">-</Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Editar / Promover">
                          <IconButton color="primary" onClick={() => handleEditClick(user)} size="small" sx={{ mr: 1 }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remover">
                          <IconButton color="error" onClick={() => handleDelete(user.id, user.nome)} size="small">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* MODAL DE EDIÇÃO */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #eee' }}>
          Editar Usuário: {editingUser?.nome}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
           <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Perfil de Acesso</InputLabel>
              <Select value={selectedRole} label="Perfil de Acesso" onChange={(e) => setSelectedRole(e.target.value)}>
                <MenuItem value={TIPO_USUARIO.SOLICITANTE}>Solicitante (Padrão)</MenuItem>
                <MenuItem value={TIPO_USUARIO.ATENDENTE}>Atendente (Suporte)</MenuItem>
                <MenuItem value={TIPO_USUARIO.ADMINISTRADOR}>Administrador</MenuItem>
              </Select>
            </FormControl>

            {/* Select Condicional para Atendente */}
            {selectedRole === TIPO_USUARIO.ATENDENTE && (
              <FormControl fullWidth>
                <InputLabel>Setor de Atendimento</InputLabel>
                <Select value={selectedCategory} label="Setor de Atendimento" onChange={(e) => setSelectedCategory(e.target.value)}>
                  <MenuItem value=""><em>Selecione um setor...</em></MenuItem>
                  {categorias.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.nome}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button onClick={() => setEditOpen(false)} color="inherit">Cancelar</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="success" disabled={saving}>
            {saving ? <CircularProgress size={24} color="inherit" /> : 'Salvar Alterações'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}