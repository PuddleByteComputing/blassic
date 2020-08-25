import { createMuiTheme } from '@material-ui/core/styles';
import createPalette from '@material-ui/core/styles/createPalette';
import createTypography from '@material-ui/core/styles/createTypography';

import { amber, cyan } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: amber,
    secondary: cyan,
  },
  typography: {
    fontFamily: ['"Lora"', '"Courier New"', 'monospace', 'serif'].join(','),
    fontSize: 18,
  },
});

export default theme;
