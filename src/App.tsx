import React, { useEffect, useRef, useState, MutableRefObject } from 'react';
import { Grid } from '@material-ui/core';

import GameDataProvider from './GameDataProvider';
import ScoreBoard from './scoreboard';
import Splash from './Splash';
import Controls from './controls/';

import styles from './App.module.scss';

function App() {
  const ticking: React.MutableRefObject<ReturnType<typeof setTimeout> | null> = useRef(null);
  const [turnNumber, setTurnNumber] = useState(0);
  const [playing, playBall] = useState(false);
  const dawdling = useRef(1000); // ms between pitches
  const dawdle = (val: number) => dawdling.current = val;

  const tick = () => {
    if (playing) {
      if (!ticking.current) {
        ticking.current =
          setTimeout(() => {
            ticking.current = null;
            setTurnNumber(turnNumber + 1);
          }, dawdling.current);
      }
    } else if (ticking.current !== null) {
      // cancel any ticking whenever playing is set to false
      clearTimeout(ticking.current);
    }
  };

  useEffect(tick, [playing, turnNumber]);

  return (
    <GameDataProvider>
      <div className={styles.gridwrap}>
        <Grid container className={styles.controls}>
          <Controls
            dawdle={dawdle}
            dawdling={dawdling.current}
            playing={playing}
            playBall={playBall}
            turnNumber={turnNumber}
            setTurnNumber={setTurnNumber}
          />
        </Grid >
        <Splash />
        <ScoreBoard turnNumber={turnNumber} />
      </div>
    </GameDataProvider>
  );
}

export default App;
