import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
// Use a different typeface font if you want your bundle to include a different font.
// You can then refer to this fond directly in CSS.
// Example:
// import 'typeface-poppins';
// ... then in appTheme:
// typography: { fontFamily: 'Poppins' }
// Test it well: other components may still use the default font.
// Default font: import 'typeface-roboto';

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
    // background: {
    //   default: '#EEF5FD',
    // },
    // primary: {
    //   main: '#3996D3',
    // },
    // secondary: {
    //   main: '#FFA07A',
    // },
  },
  overrides: {
    // MuiExpansionPanelSummary: {
    //   content: {
    //     fontWeight: 'bold',
    //   },
    // },
    // MuiTypography: {
    //   body1: {
    //     margin: '1em 0',
    //   },
    // },
  },
};
