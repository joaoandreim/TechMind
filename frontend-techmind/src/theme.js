'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // pode trocar para 'dark' depois se quiser
    primary: {
      main: '#1976d2', // azul principal
    },
    secondary: {
      main: '#9c27b0', // roxo
    },
    background: {
      default: '#f5f5f5', // cor de fundo geral
      paper: '#ffffff', // fundo dos cards, etc.
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: {
      fontWeight: 700,
    },
    button: {
      textTransform: 'none', // deixa o texto dos botões normal (sem caixa alta)
    },
  },
});

export default theme;
