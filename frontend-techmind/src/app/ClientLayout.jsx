'use client';

import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '../lib/theme';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { ToastProvider } from '../components/Ui/ToastProvider';

export default function ClientLayout({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <div style={{ flex: 1 }}>
            <Navbar />
            <main style={{ padding: 24 }}>{children}</main>
          </div>
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}
