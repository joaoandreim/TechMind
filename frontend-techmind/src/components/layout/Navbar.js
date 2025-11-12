'use client';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import useAuth from '../../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Botão de menu (útil no mobile) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconButton color="inherit" edge="start">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            TechMind
          </Typography>
        </div>

        {/* Sessão de usuário */}
        {user ? (
          <Button color="inherit" onClick={logout}>
            Sair
          </Button>
        ) : (
          <Button color="inherit" href="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}