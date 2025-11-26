import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

export default function Navbar({ open, toggleDrawer, drawerWidth, closedWidth }) {
  return (
    <AppBar 
      position="fixed"
      sx={{ 
          width: open 
          ? `calc(100% - ${drawerWidth}px)` 
          : `calc(100% - ${closedWidth}px)`,
          marginLeft: open ? `${drawerWidth}px` : `${closedWidth}px`,
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: 'width 0.3s ease-in-out, margin-left 0.3s ease-in-out',
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
