'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container, Typography, Box, Card, CardContent, Grid,
  CircularProgress, Paper, Avatar, LinearProgress, Stack, Button
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningIcon from '@mui/icons-material/Warning';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonIcon from '@mui/icons-material/Person';

import useAuth from '../../../hooks/authContext';
import api from '../../../lib/api';

export default function AtendenteDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    abertos: 0,
    andamento: 0,
    meusAtendimentos: 0 
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get('/chamado');
        let todos = response.data;

        if (user?.categoria?.id) {
            todos = todos.filter(c => c.categoria?.id === user.categoria.id);
        }

        const abertos = todos.filter(c => c.status === 'Aberto');
        const andamento = todos.filter(c => c.status === 'Em Andamento');
        
        const meus = todos.filter(c => 
            c.status !== 'Fechado' && 
            c.usuarioChamados?.some(v => v.usuario?.id === user?.id)
        );
        
        setStats({
          total: todos.length,
          abertos: abertos.length,
          andamento: andamento.length,
          meusAtendimentos: meus.length
        });

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    if (user?.id) fetchData();
  }, [user]);

  const KpiCard = ({ title, value, icon: Icon, color, onClick, alert }) => (
    <Card
      elevation={0}
      onClick={onClick}
      sx={{
        height: '100%',
        border: '1px solid #e0e0e0',
        borderRadius: 3,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s',
        '&:hover': onClick ? { transform: 'translateY(-4px)', borderColor: color, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' } : {},
        position: 'relative', overflow: 'hidden'
      }}
    >
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', bgcolor: color }} />
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Avatar sx={{ bgcolor: `${color}15`, color: color, borderRadius: 2 }}>
            <Icon />
          </Avatar>
          {onClick && <ArrowForwardIcon sx={{ color: 'text.disabled', fontSize: 20 }} />}
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 800, color: alert ? '#e53e3e' : '#2d3748' }}>
          {loading ? <CircularProgress size={24} /> : value}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={600}>{title}</Typography>
      </CardContent>
    </Card>
  );

  const ActionCard = ({ title, desc, icon: Icon, onClick, color }) => (
    <Card
      elevation={0}
      onClick={onClick}
      sx={{
        p: 2, border: '1px solid #e0e0e0', borderRadius: 3, cursor: 'pointer',
        transition: '0.2s', '&:hover': { bgcolor: `${color}08`, borderColor: color }
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar sx={{ bgcolor: color, width: 40, height: 40 }}>
          <Icon fontSize="small" />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">{title}</Typography>
          <Typography variant="caption" color="text.secondary">{desc}</Typography>
        </Box>
      </Stack>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a202c' }}>Central de Atendimento</Typography>
          <Typography variant="body1" color="text.secondary">
            Olá, <strong>{user?.nome}</strong>. Aqui está o panorama da fila.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard 
            title="Meus Atendimentos" 
            value={stats.meusAtendimentos} 
            icon={PersonIcon} 
            color="#805ad5"
            
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard 
            title="Fila de Espera (Abertos)" 
            value={stats.abertos} 
            icon={WarningIcon} 
            color="#e53e3e"
            alert={stats.abertos > 0}
            onClick={() => router.push('/atendente/chamados')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard 
            title="Em Andamento (Geral)" 
            value={stats.andamento} 
            icon={AssignmentIcon} 
            color="#dd6b20"
            onClick={() => router.push('/atendente/chamados')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard 
            title="Total de Tickets" 
            value={stats.total} 
            icon={PlaylistAddCheckIcon} 
            color="#3182ce" 
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Volume de Trabalho</Typography>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 3 }}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" fontWeight={600}>Tickets Pendentes</Typography>
                <Typography variant="body2" color="text.secondary">
                   {stats.total > 0 ? Math.round((stats.abertos / stats.total) * 100) : 0}% do total
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={stats.total > 0 ? (stats.abertos / stats.total) * 100 : 0} 
                sx={{ height: 10, borderRadius: 5, bgcolor: '#edf2f7', '& .MuiLinearProgress-bar': { bgcolor: '#e53e3e' } }} 
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Ações Rápidas</Typography>
          <Stack spacing={2}>
            <ActionCard 
              title="Ver Fila Completa" 
              desc="Acessar lista de chamados para atender" 
              icon={AssignmentIcon} 
              color="#3182ce" 
              onClick={() => router.push('/atendente/chamados')}
            />
            <ActionCard 
              title="Novo Chamado Interno" 
              desc="Registrar chamado manualmente" 
              icon={AddIcon} 
              color="#00b65e" 
              onClick={() => router.push('/atendente/chamados/novo')}
            />
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}