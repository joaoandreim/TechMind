'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Button, CssBaseline, TextField, Paper, Box, Typography, 
  CircularProgress, Link, Avatar, Container, FormControl, InputLabel, Select, MenuItem, Alert 
} from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import useAuth from '../../hooks/authContext';
import { useToast } from '../../components/Ui/ToastProvider';
import api from '../../lib/api';
import { TIPO_USUARIO } from '../../lib/constants';

function Copyright(props) {
  return (
    <Typography variant="body2" align="center" {...props} sx={{ color: 'rgba(255,255,255,0.8)', mt: 4 }}>
      {'Copyright © '}
      <Link color="inherit" href="#" sx={{ fontWeight: 'bold', textDecoration: 'none' }}>
        TechMind
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function CadastroPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipoUsuarioId, setTipoUsuarioId] = useState(TIPO_USUARIO.SOLICITANTE);
  const [existeAdmin, setExisteAdmin] = useState(true); 
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { show } = useToast();

  useEffect(() => {
    api.get('/usuario/verificar/admin-existe')
      .then((res) => {
        setExisteAdmin(res.data); 
        if (res.data) setTipoUsuarioId(TIPO_USUARIO.SOLICITANTE);
        else setTipoUsuarioId(TIPO_USUARIO.ADMINISTRADOR);
      })
      .catch(() => setExisteAdmin(true)); 
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/usuario', {
        nome,
        email,
        senha,
        tipoUsuario: { id: Number(tipoUsuarioId) } 
      });

      show('Conta criada com sucesso! Faça login.', 'success');
      router.push('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Erro ao realizar cadastro.';
      show(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        width: '100vw',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #00b65e 0%, #008f4c 100%)',
        py: 4
      }}
    >
      <CssBaseline />
      
      <Container component="main" maxWidth="xs">
        <Paper 
          elevation={10} 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            borderRadius: 3,
            backgroundColor: '#ffffff'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#e8f5e9', width: 64, height: 64 }}>
            <PersonAddOutlinedIcon sx={{ color: '#00b65e', fontSize: 32 }} />
          </Avatar>
          
          <Typography component="h1" variant="h4" sx={{ fontWeight: 800, color: '#00b65e', letterSpacing: '-1px' }}>
            TechMind.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Crie sua nova conta
          </Typography>

          <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 1, width: '100%' }}>
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Nome Completo"
              autoFocus
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00b65e' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#00b65e' }
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00b65e' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#00b65e' }
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00b65e' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#00b65e' }
              }}
            />

            {!existeAdmin && (
              <Box sx={{ mt: 2 }}>
                <Alert severity="info" sx={{ mb: 2, fontSize: '0.85rem' }}>
                  Configuração Inicial: Crie o primeiro Admin.
                </Alert>
                <FormControl fullWidth>
                  <InputLabel sx={{ '&.Mui-focused': { color: '#00b65e' } }}>Tipo de Perfil</InputLabel>
                  <Select
                    value={tipoUsuarioId}
                    label="Tipo de Perfil"
                    onChange={(e) => setTipoUsuarioId(e.target.value)}
                    sx={{ '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00b65e' } }}
                  >
                    <MenuItem value={TIPO_USUARIO.SOLICITANTE}>Solicitante</MenuItem>
                    <MenuItem value={TIPO_USUARIO.ADMINISTRADOR}>Administrador</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ 
                mt: 4, 
                mb: 2, 
                py: 1.5, 
                bgcolor: '#00b65e', 
                '&:hover': { bgcolor: '#00944d' },
                fontSize: '1rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 10px rgba(0, 182, 94, 0.4)'
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'CADASTRAR'}
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link 
                component="button"
                type="button"
                variant="body2" 
                onClick={() => router.push('/login')}
                sx={{ textDecoration: 'none', color: '#00b65e', fontWeight: 600 }}
              >
                Já tem uma conta? Entre aqui
              </Link>
            </Box>
          </Box>
        </Paper>
        
        <Copyright />
      </Container>
    </Box>
  );
}