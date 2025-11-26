'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container, Typography, Box, Card, CardContent, Grid,
  CircularProgress, Paper, Avatar, LinearProgress, Stack, Button
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ListIcon from '@mui/icons-material/List';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FolderSharedIcon from '@mui/icons-material/FolderShared';

import useAuth from '../../../hooks/authContext';
import api from '../../../lib/api';

export default function SolicitanteDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    abertos: 0,
    finalizados: 0,
    resolucaoRate: 0
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get('/chamado');
        const meusChamados = response.data.filter(chamado => 
          chamado.usuarioChamados?.some(vinculo => vinculo.usuario?.id === user?.id)
        );

        const abertos = meusChamados.filter(c => c.status !== 'Fechado').length;
        const finalizados = meusChamados.filter(c => c.status === 'Fechado').length;
        const total = meusChamados.length;
        const rate = total > 0 ? Math.round((finalizados / total) * 100) : 0;

        setStats({ total, abertos, finalizados, resolucaoRate: rate });
      } catch (error) {
        console.error('Erro ao carregar dashboard', error);
      } finally {
        setLoading(false);
      }
    }
    if (user?.id) fetchData();
  }, [user]);

  const KpiCard = ({ title, value, icon: Icon, color, onClick }) => (
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
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#2d3748' }}>
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
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a202c' }}>Olá, {user?.nome}</Typography>
          <Typography variant="body1" color="text.secondary">Acompanhe suas solicitações de suporte.</Typography>
        </Box>
      </Box>

      {/* KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <KpiCard 
            title="Em Aberto" 
            value={stats.abertos} 
            icon={AccessTimeIcon} 
            color="#ed8936"
            onClick={() => router.push('/solicitante/chamados')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KpiCard 
            title="Finalizados" 
            value={stats.finalizados} 
            icon={CheckCircleIcon} 
            color="#00b65e"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KpiCard 
            title="Total Histórico" 
            value={stats.total} 
            icon={FolderSharedIcon} 
            color="#3182ce"
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* STATUS */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Status dos Meus Pedidos</Typography>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 3 }}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" fontWeight={600}>Taxa de Solução</Typography>
                <Typography variant="body2" color="text.secondary">{stats.resolucaoRate}%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={stats.resolucaoRate} 
                sx={{ height: 10, borderRadius: 5, bgcolor: '#edf2f7', '& .MuiLinearProgress-bar': { bgcolor: '#00b65e' } }} 
              />
            </Box>
          </Paper>
        </Grid>

        {/* AÇÕES */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>O que deseja fazer?</Typography>
          <Stack spacing={2}>
            <ActionCard 
              title="Abrir Novo Chamado" 
              desc="Relatar um problema ou solicitar serviço" 
              icon={AddCircleIcon} 
              color="#00b65e" 
              onClick={() => router.push('/solicitante/chamados/novo')}
            />
            <ActionCard 
              title="Meus Chamados" 
              desc="Ver histórico e interagir" 
              icon={ListIcon} 
              color="#3182ce" 
              onClick={() => router.push('/solicitante/chamados')}
            />
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}