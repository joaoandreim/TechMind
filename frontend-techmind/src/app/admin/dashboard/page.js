'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container, Typography, Box, Card, CardContent, Grid,
  CircularProgress, Paper, Avatar, LinearProgress, Stack
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import useAuth from '../../../hooks/authContext';
import api from '../../../lib/api';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    usersTotal: 0,
    chamadosTotal: 0,
    chamadosAbertos: 0,
    chamadosFechados: 0,
    categoriasTotal: 0,
    resolucaoRate: 0
  });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [resUsers, resChamados, resCats] = await Promise.all([
          api.get('/usuario'),
          api.get('/chamado'),
          api.get('/categoria')
        ]);

        const chamados = resChamados.data;
        const abertos = chamados.filter(c => c.status === 'Aberto' || c.status === 'Em Andamento').length;
        const fechados = chamados.filter(c => c.status === 'Fechado').length;
        const total = chamados.length;
        const rate = total > 0 ? Math.round((fechados / total) * 100) : 0;

        setStats({
          usersTotal: resUsers.data.length,
          chamadosTotal: total,
          chamadosAbertos: abertos,
          chamadosFechados: fechados,
          categoriasTotal: resCats.data.length,
          resolucaoRate: rate
        });

      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const KpiCard = ({ title, value, icon: Icon, color, onClick, subtext }) => (
    <Card
      elevation={0}
      onClick={onClick}
      sx={{
        height: '100%',
        border: '1px solid #e0e0e0',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
          borderColor: color
        } : {},
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', bgcolor: color }} />
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Avatar sx={{ bgcolor: `${color}15`, color: color, width: 48, height: 48, borderRadius: 2 }}>
            <Icon fontSize="medium" />
          </Avatar>
          {onClick && <ArrowForwardIcon sx={{ color: 'text.disabled', fontSize: 20 }} />}
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#2d3748', mb: 0.5 }}>
          {loading ? <CircularProgress size={24} color="inherit" /> : value}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={600}>
          {title}
        </Typography>
        {subtext && (
           <Typography variant="caption" sx={{ display: 'block', mt: 1, color: color, fontWeight: 600 }}>
             {subtext}
           </Typography>
        )}
      </CardContent>
    </Card>
  );

  const ActionCard = ({ title, desc, icon: Icon, onClick, color }) => (
    <Card
      elevation={0}
      onClick={onClick}
      sx={{
        p: 2,
        border: '1px solid #e0e0e0',
        borderRadius: 3,
        cursor: 'pointer',
        transition: '0.2s',
        '&:hover': { bgcolor: `${color}08`, borderColor: color }
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
      {/* HEADER */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a202c', letterSpacing: '-0.5px' }}>
          Dashboard Administrativo
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Visão geral da performance e gestão do sistema.
        </Typography>
      </Box>

      {/* KPIs */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="Usuários Totais"
            value={stats.usersTotal}
            icon={PeopleIcon}
            color="#00b65e"
            onClick={() => router.push('/admin/usuarios')}
            subtext="Gerenciar Acessos"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="Chamados Totais"
            value={stats.chamadosTotal}
            icon={AssignmentIcon}
            color="#3182ce"
            onClick={() => router.push('/admin/chamados')}
            subtext="Ver Todos"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="Taxa de Resolução"
            value={`${stats.resolucaoRate}%`}
            icon={CheckCircleIcon}
            color="#805ad5" // Roxo
            subtext={`${stats.chamadosFechados} Finalizados`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="Pendentes"
            value={stats.chamadosAbertos}
            icon={WarningIcon}
            color="#e53e3e"
            onClick={() => router.push('/admin/chamados')}
            subtext="Requer Atenção"
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* SEÇÃO OPERACIONAL (Barras de Progresso) */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Saúde do Sistema</Typography>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 3 }}>
            
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" fontWeight={600}>Progresso de Resolução</Typography>
                <Typography variant="body2" fontWeight={600} color="text.secondary">{stats.resolucaoRate}%</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={stats.resolucaoRate}
                sx={{ height: 10, borderRadius: 5, bgcolor: '#edf2f7', '& .MuiLinearProgress-bar': { bgcolor: '#00b65e' } }}
              />
            </Box>

             <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" fontWeight={600}>Carga de Trabalho (Pendências)</Typography>
                <Typography variant="body2" fontWeight={600} color="text.secondary">
                    {stats.chamadosTotal > 0 ? Math.round((stats.chamadosAbertos / stats.chamadosTotal) * 100) : 0}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={stats.chamadosTotal > 0 ? (stats.chamadosAbertos / stats.chamadosTotal) * 100 : 0}
                sx={{ height: 10, borderRadius: 5, bgcolor: '#edf2f7', '& .MuiLinearProgress-bar': { bgcolor: '#e53e3e' } }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* SEÇÃO DE ACESSO RÁPIDO */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Ações Rápidas</Typography>
          <Stack spacing={2}>
            <ActionCard
              title="Gerenciar Usuários"
              desc="Adicionar, remover ou editar permissões"
              icon={PeopleIcon}
              color="#00b65e"
              onClick={() => router.push('/admin/usuarios')}
            />
            <ActionCard
              title="Categorias"
              desc="Configurar tipos de chamados"
              icon={CategoryIcon}
              color="#3182ce"
              onClick={() => router.push('/admin/categorias')}
            />
            <ActionCard
              title="Monitorar Chamados"
              desc="Visão global de todos os tickets"
              icon={AssessmentIcon}
              color="#d69e2e"
              onClick={() => router.push('/admin/chamados')}
            />
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}