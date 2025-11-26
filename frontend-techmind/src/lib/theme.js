'use client';
import { createTheme } from '@mui/material/styles';
import { ptBR } from '@mui/material/locale';

const theme = createTheme(
  {
    palette: {
      mode: 'light',
      primary: {
        main: '#00b65e', // ✅ SUA NOVA COR VERDE
        contrastText: '#ffffff', // Texto branco para contraste
      },
      secondary: {
        main: '#1976d2', // Azul como secundária (bom para links/info)
      },
      background: {
        default: '#f5f5f5', 
        paper: '#ffffff',
      },
      // Cores de status personalizadas
      success: {
        main: '#00b65e', // Alinha o sucesso com a cor da marca
      },
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
      h4: {
        fontWeight: 700,
        color: '#2d3748', // Cinza escuro para títulos (mais legível que verde puro)
      },
      h5: {
        fontWeight: 600,
        color: '#2d3748',
      },
      h6: {
        fontWeight: 600,
        color: '#4a5568',
      }
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            padding: '10px 20px',
            fontSize: '1rem',
          },
          containedPrimary: {
            '&:hover': {
              backgroundColor: '#00944d', // Um verde um pouco mais escuro no hover
            },
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
        },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#00b65e', // Borda verde ao focar
                borderWidth: '2px',
              },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#00b65e', // Label verde ao focar
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
            border: '1px solid #eaedf2',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: '#ffffff', // Barra branca para look "clean"
            color: '#2d3748', // Texto escuro
            borderBottom: '1px solid #e2e8f0',
            boxShadow: 'none',
          }
        }
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: '#1a202c', // Sidebar escura para contraste profissional
            color: '#ffffff',
          }
        }
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: 'rgba(255, 255, 255, 0.7)', // Ícones claros na sidebar
          }
        }
      },
      MuiListItemText: {
        styleOverrides: {
          primary: {
            fontSize: '0.95rem',
          }
        }
      }
    },
  },
  ptBR
);

export default theme;