'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastProvider } from '../components/Ui/ToastProvider';
import { AuthProvider } from '../hooks/authContext';
import theme from '../lib/theme';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <title>TechMind - Sistema de Chamados</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}