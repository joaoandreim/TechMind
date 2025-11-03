'use client';

import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '../theme'; 
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
