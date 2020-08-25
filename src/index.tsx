import React from 'react';
import ReactDOM from 'react-dom';
import { CssBaseline, StylesProvider, ThemeProvider } from '@material-ui/core';

import theme from './theme';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </StylesProvider>
  </React.StrictMode>,
  document.getElementById('blase')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
