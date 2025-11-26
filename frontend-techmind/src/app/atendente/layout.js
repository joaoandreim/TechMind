'use client';

import SidebarLayout from '../../components/Ui/SidebarLayout';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ListAltIcon from '@mui/icons-material/ListAlt';

const menuOptions = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/atendente/dashboard' },
  { text: 'Todos os Chamados', icon: <ListAltIcon />, path: '/atendente/chamados' },
  { text: 'Abrir Chamado', icon: <AddCircleOutlineIcon />, path: '/atendente/chamados/novo' },
];

export default function AtendenteLayout({ children }) {
  return (
    <SidebarLayout title="Área do Atendente" menuItems={menuOptions}>
      {children}
    </SidebarLayout>
  );
}