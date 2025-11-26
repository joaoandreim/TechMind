'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  Box, AppBar, Toolbar, Typography, Drawer, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, IconButton, Button,
  Divider, Avatar, Tooltip, useMediaQuery, useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import LogoutIcon from '@mui/icons-material/Logout';
import useAuth from '../../hooks/authContext';

const DRAWER_WIDTH_OPEN = 260;
const DRAWER_WIDTH_CLOSED = 70;

export default function SidebarLayout({ children, title, menuItems }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const currentDrawerWidth = isDesktop 
    ? (isSidebarOpen ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED) 
    : DRAWER_WIDTH_OPEN;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarCollapse = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      {/* LOGO ÁREA */}
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: isSidebarOpen ? 'space-between' : 'center', 
        alignItems: 'center',
        px: isSidebarOpen ? 2 : 1, 
        minHeight: '70px',
        transition: 'all 0.3s ease'
      }}>
        {isSidebarOpen ? (
          <Typography variant="h5" noWrap component="div" sx={{ color: '#00b65e', fontWeight: 800, letterSpacing: '-1px', ml: 1 }}>
            TechMind.
          </Typography>
        ) : (
          // Ícone Favicon quando recolhido
          <Box sx={{ position: 'relative', width: 32, height: 32 }}>
             <Image src="/favicon.ico" alt="Logo" width={32} height={32} style={{ objectFit: 'contain' }} />
          </Box>
        )}

        {/* Botão de Recolher (Só aparece no Desktop e quando aberto) */}
        {isDesktop && isSidebarOpen && (
          <IconButton onClick={handleSidebarCollapse} size="small" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            <MenuOpenIcon />
          </IconButton>
        )}
      </Toolbar>
      
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 2 }} />

      {/* MENU */}
      <List sx={{ px: 1, flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 1 }}>
            <Tooltip title={!isSidebarOpen ? item.text : ""} placement="right" arrow>
              <ListItemButton 
                selected={pathname === item.path}
                onClick={() => router.push(item.path)}
                sx={{
                  minHeight: 48,
                  justifyContent: isSidebarOpen ? 'initial' : 'center',
                  px: 2.5,
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&.Mui-selected': {
                    bgcolor: '#00b65e !important',
                    color: 'white',
                    '& .MuiListItemIcon-root': { color: 'white' }
                  },
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isSidebarOpen ? 2 : 'auto',
                    justifyContent: 'center',
                    color: pathname === item.path ? 'white' : 'rgba(255,255,255,0.7)'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ fontWeight: 500, fontSize: '0.95rem' }} 
                  sx={{ opacity: isSidebarOpen ? 1 : 0, display: isSidebarOpen ? 'block' : 'none' }} 
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      {/* USUÁRIO LOGADO (Rodapé) */}
      <Box sx={{ p: isSidebarOpen ? 2 : 1, bgcolor: 'rgba(0,0,0,0.2)', transition: 'all 0.3s' }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: isSidebarOpen ? 'flex-start' : 'center', 
          gap: 2 
        }}>
          <Avatar sx={{ bgcolor: '#00b65e', width: 40, height: 40, fontSize: '1rem' }}>
            {user?.nome?.[0] || 'U'}
          </Avatar>
          
          {isSidebarOpen && (
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }} noWrap>
                {user?.nome}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }} noWrap>
                {user?.email}
              </Typography>
            </Box>
          )}
        </Box>
        
        {isSidebarOpen && (
          <Button 
            color="error" 
            size="small" 
            startIcon={<LogoutIcon />} 
            onClick={logout} 
            sx={{ mt: 2, width: '100%', justifyContent: 'flex-start' }}
          >
            Sair do sistema
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* APP BAR SUPERIOR */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { sm: `${currentDrawerWidth}px` },
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: '#ffffff',
          color: '#2d3748',
          boxShadow: 'none',
          borderBottom: '1px solid #e2e8f0',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          {/* Botão Hamburguer (Mobile) */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' }, color: '#00b65e' }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Botão Hamburguer (Desktop - Para Reabrir a Sidebar) */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleSidebarCollapse}
            sx={{ 
              mr: 2, 
              display: { xs: 'none', sm: 'flex' }, 
              color: '#00b65e',
              ...(isSidebarOpen && { display: 'none' }) // Esconde se já estiver aberto (o botão de fechar está dentro)
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {title}
          </Typography>

          {/* Botão Sair Rápido (Quando a sidebar está fechada) */}
          {!isSidebarOpen && isDesktop && (
             <IconButton onClick={logout} color="error" title="Sair do sistema">
               <LogoutIcon />
             </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* DRAWER DE NAVEGAÇÃO */}
      <Box
        component="nav"
        sx={{ width: { sm: currentDrawerWidth }, flexShrink: { sm: 0 }, transition: 'width 0.3s ease' }}
      >
        {/* Gaveta Mobile (Temporária) */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH_OPEN, 
              bgcolor: '#1a202c', 
              color: 'white' 
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Gaveta Desktop (Permanente com largura variável) */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: currentDrawerWidth, 
              borderRight: 'none', 
              bgcolor: '#1a202c', 
              color: 'white',
              overflowX: 'hidden',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* CONTEÚDO PRINCIPAL */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${currentDrawerWidth}px)` }, 
          minHeight: '100vh', 
          bgcolor: '#f8f9fa',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}