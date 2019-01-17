import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';

export const appTheme: ThemeOptions = {
  typography: {
    useNextVariants: true,
    button: {
      textTransform: 'none',
    },
    // fontSize: 24, // Instead, this example uses a dynamic font size in index.css
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
        textDecoration: 'underline',
        '&:hover': {
          textDecoration: 'underline',
        },
      },
    },
  },
};
