import React, { useContext } from 'react';
import { Grid } from '@material-ui/core';

import { gameDataContext } from '../GameDataProvider';
import { clockContext } from '../ClockProvider';
import GameSelect from './GameSelect';
import PlayPauseButton from './PlayPauseButton';
import Speed from './Speed';
import FastForwardButton from './FastForwardButton';
import SkipForwardButton from './SkipForwardButton';
import RewindButton from './RewindButton';
import SkipBackButton from './SkipBackButton';

import styles from './index.module.scss';

function Controls() {
  const { turnCount } = useContext(gameDataContext);
  const { dawdle, dawdling } = useContext(clockContext);

  return (
    <Grid container className={styles.controls}>
      <Grid item container xs={12} md={4} alignContent="center" justify="flex-start" className={styles.gamepicker}>
        <GameSelect />
      </Grid>
      <Grid item container xs={12} md={4} alignContent="center" justify="center">
        <SkipBackButton />
        <RewindButton />
        <PlayPauseButton turnCount={turnCount} />
        <FastForwardButton />
        <SkipForwardButton />
      </Grid>
      <Grid item container xs={12} md={4} alignContent="center">
        <Speed dawdling={dawdling} dawdle={dawdle} />
      </Grid>
    </Grid>
  );
}

export default Controls;
