import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
// Use a different typeface font if you want your bundle to include a different font.
// You can then refer to this fond directly in CSS.
// Example:
// import 'typeface-poppins';
// ... then in appTheme:
// typography: { fontFamily: 'Poppins' }
// Test it well: other components may still use the default font.
import 'typeface-roboto';

export const appTheme: ThemeOptions = {
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    //   // fontSize: 24,
  },
  palette: {
    type: 'dark',
    //   background: {
    //     default: '#282c34',
    //   },
    //   primary: {
    //     main: '#61dafb',
    //   },
    // },
    // overrides: {
    //   MuiTypography: {
    //     body1: {
    //       margin: '1em 0',
    //     },
    //   },
  },
};
