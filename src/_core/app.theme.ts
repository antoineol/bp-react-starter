import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';

export const appTheme: ThemeOptions = {
  typography: {
    useNextVariants: true,
  },
  palette: {
    type: 'dark',
    background: {
      default: '#282c34',
    },
    primary: {
      main: '#61dafb',
    },
  },
  overrides: {
    MuiTypography: {
      body1: {
        margin: '1em 0',
      },
    },
    MuiButton: {
      text: {
        textTransform: 'none',
        textDecoration: 'underline',
        '&:hover': {
          textDecoration: 'underline',
        },
      },
    },
  },
};
