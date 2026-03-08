import { createTheme, PaletteOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    customColors: {
      green: string;
      brown: string;
      pink: string;
      grey: string;
      red: string;
      dark: string;
    };
  }
  interface PaletteOptions {
    customColors?: {
      green: string;
      brown: string;
      pink: string;
      grey: string;
      red: string;
      dark: string;
    };
  }
}

export const theme = createTheme({
  typography: {
    fontFamily: '"Nunito Sans", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 900, 
      fontSize: '3.5rem',
    },
    h2: {
      fontWeight: 800, 
      fontSize: '2.8rem',
    },
    h3: {
      fontWeight: 700, 
      fontSize: '2.2rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.8rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.2rem',
    },
    subtitle1: {
      fontWeight: 400,
      fontSize: '1rem',
    },
    subtitle2: {
      fontWeight: 400, 
      fontSize: '0.875rem',
    },
    body1: {
      fontWeight: 400, 
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    button: {
      fontWeight: 600, 
      textTransform: 'none',
    },
    caption: {
      fontWeight: 300, 
      fontSize: '0.75rem',
    },
    overline: {
      fontWeight: 600, 
      fontSize: '0.75rem',
      textTransform: 'uppercase',
    },
  },
  palette: {
    primary: {
      main: '#3c4f6f',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#8aa2c4',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    customColors: {
      green: '#B7BF96',
      brown: '#BF9550',
      pink: '#E6B5A6',
      grey: '#E8E2DB', 
      red: '#E25439',
      dark: '#436B5C',
    },
  } as PaletteOptions,
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', 
          fontWeight: 600, 
          borderRadius: 12,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: '"Nunito Sans", "Helvetica", "Arial", sans-serif',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderRadius: 16,
        },
      },
    },
  },
});
