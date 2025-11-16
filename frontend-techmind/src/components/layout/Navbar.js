import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

export default function Navbar({ open, toggleDrawer }) {
  return (
    <AppBar 
      position="sticky"
      sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="toggle drawer"
          onClick={toggleDrawer}
          edge="start"
          sx={{ marginRight: 2 }}
        >
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
        
        <Typography variant="h6" noWrap component="div">
          Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
