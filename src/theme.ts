import { createMuiTheme } from '@material-ui/core/styles';
import { amber, cyan } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: amber,
    secondary: cyan,
  },
  typography: {
    fontFamily: ['"Lora"', 'serif'].join(','),
  },
});

export default theme;
