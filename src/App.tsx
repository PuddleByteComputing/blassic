import React from 'react';

import GameDataProvider from './GameDataProvider';
import ClockProvider from './ClockProvider';
import ScoreBoard from './scoreboard';
import Splash from './Splash';
import Controls from './controls/';
import Credits from './Credits';

import styles from './App.module.scss';

function App() {
  return (
    <GameDataProvider>
      <ClockProvider>
        <div className={styles.gridwrap}>
          <Controls />
          <Splash />
          <ScoreBoard />
          <Credits />
        </div>
      </ClockProvider>
    </GameDataProvider>
  );
}

export default App;
