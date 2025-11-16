import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CategoryIcon from '@mui/icons-material/Category';
import AddIcon from '@mui/icons-material/Add';
import ListItemIcon from '@mui/material/ListItemIcon';


export default function Sidebar({ open, drawerWidth, closedWidth }) { 
  const menuItems = [
    { text: 'Dashboard', href: '/', icon: <DashboardIcon /> },
    { text: 'Chamados', href: '/chamados', icon: <AssignmentIcon /> },
    { text: 'Novo Chamado', href: '/chamados/novo', icon: <AddIcon /> },
    { text: 'Categorias', href: '/categorias', icon: <CategoryIcon /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : closedWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : closedWidth,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          overflowX: 'hidden',
          transition: 'width 0.3s ease-in-out',
        },
      }}
    >
      <Typography
        variant="h6"
        sx={{
          p: 2,
          textAlign: 'center',
          fontWeight: 600,
          opacity: open ? 1 : 0, 
          whiteSpace: 'nowrap',
          transition: 'opacity 0.3s ease-in-out',
        }}
      >
        TechMind
      </Typography>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <Link key={item.text} href={item.href} passHref legacyBehavior>
            <ListItemButton component="a">
                <ListItemIcon sx={{ minWidth: 40, justifyContent: 'center' }}>
                    {item.icon}
                </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ opacity: open ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }} 
              />
            </ListItemButton>
          </Link>
        ))}
      </List>
    </Drawer>
  );
}
