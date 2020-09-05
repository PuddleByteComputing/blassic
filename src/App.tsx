import React from 'react';
import { Grid } from '@material-ui/core';

import GameDataProvider from './GameDataProvider';
import ClockProvider from './ClockProvider';
import ScoreBoard from './scoreboard';
import Splash from './Splash';
import Controls from './controls/';

import styles from './App.module.scss';

function App() {
  return (
    <GameDataProvider>
      <ClockProvider>
        <div className={styles.gridwrap}>
          <Grid container className={styles.controls}>
            <Controls />
          </Grid >
          <Splash />
          <ScoreBoard />
        </div>
      </ClockProvider>
    </GameDataProvider>
  );
}

export default App;
