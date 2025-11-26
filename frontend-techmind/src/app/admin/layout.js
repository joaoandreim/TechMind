'use client';

import SidebarLayout from '../../components/Ui/SidebarLayout';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';

const menuOptions = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
  { text: 'Gerenciar Usuários', icon: <PeopleIcon />, path: '/admin/usuarios' },
  { text: 'Gerenciar Categorias', icon: <CategoryIcon />, path: '/admin/categorias' },
  { text: 'Todos os Chamados', icon: <AssignmentIcon />, path: '/admin/chamados' }, 
];

export default function AdminLayout({ children }) {
  return (
    <SidebarLayout title="Administração" menuItems={menuOptions}>
      {children}
    </SidebarLayout>
  );
}