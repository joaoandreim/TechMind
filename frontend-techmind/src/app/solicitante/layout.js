'use client';

import SidebarLayout from '../../components/Ui/SidebarLayout';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ListIcon from '@mui/icons-material/List';
import DashboardIcon from '@mui/icons-material/Dashboard'; // Importar ícone

const menuOptions = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/solicitante/dashboard' },
  { text: 'Abrir Chamado', icon: <AddCircleIcon />, path: '/solicitante/chamados/novo' },
  { text: 'Meus Chamados', icon: <ListIcon />, path: '/solicitante/chamados' },
];

export default function SolicitanteLayout({ children }) {
  return (
    <SidebarLayout title="Área do Solicitante" menuItems={menuOptions}>
      {children}
    </SidebarLayout>
  );
}