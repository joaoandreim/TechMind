import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import Typography from '@mui/material/Typography';

const drawerWidth = 220;

export default function Sidebar() {
  const menuItems = [
    { text: 'Dashboard', href: '/' },
    { text: 'Chamados', href: '/chamados' },
    { text: 'Novo Chamado', href: '/chamados/novo' },
    { text: 'Categorias', href: '/categorias' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
        },
      }}
    >
      <Typography
        variant="h6"
        sx={{
          p: 2,
          textAlign: 'center',
          fontWeight: 600,
        }}
      >
        TechMind
      </Typography>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <Link key={item.text} href={item.href} passHref legacyBehavior>
            <ListItemButton component="a">
              <ListItemText primary={item.text} />
            </ListItemButton>
          </Link>
        ))}
      </List>
    </Drawer>
  );
}