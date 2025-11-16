'use client';

import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from '../lib/theme';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { ToastProvider } from '../components/Ui/ToastProvider';

const drawerWidth = 220; 
const closedWidth = 60;

export default function ClientLayout({ children }) {
  const [open, setOpen] = useState(true); 

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          {/* @ts-ignore */}
          <Sidebar 
            open={open}  
            drawerWidth={drawerWidth} 
            closedWidth={closedWidth} 
          />
          
          <Box 
            component="main" 
            sx={{ 
                flexGrow: 1, 
                marginLeft: open ? `${drawerWidth}px` : `${closedWidth}px`,
                transition: 'margin-left 0.3s ease-in-out',
            }}
          >
            {/* @ts-ignore */}
            <Navbar open={open} toggleDrawer={toggleDrawer} />
            
            <Box sx={{ p: 3 }}>
                {children}
            </Box>
          </Box>
        </Box>
      </ToastProvider>
    </ThemeProvider>
  );
}
