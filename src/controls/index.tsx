import React from 'react';
import { Grid } from '@material-ui/core';

import GameSelect from './GameSelect';
import PlayPauseButton from './PlayPauseButton';
import Speed from './Speed';
import FastForwardButton from './FastForwardButton';
import SkipForwardButton from './SkipForwardButton';
import RewindButton from './RewindButton';
import SkipBackButton from './SkipBackButton';
import Counter from './Counter';

import styles from './index.module.scss';

function Controls() {
  return (
    <Grid container className={styles.controls}>
      <Grid item container xs={12} sm={4} alignContent="center" justify="flex-start" className={styles.gamepicker}>
        <GameSelect />
      </Grid>
      <Grid item container xs={12} sm={4} alignContent="center" justify="center">
        <Grid item container xs={2} />
        <Grid item container xs={8} alignContent="center" justify="center">
          <SkipBackButton />
          <RewindButton />
          <PlayPauseButton />
          <FastForwardButton />
          <SkipForwardButton />
        </Grid>
        <Grid item container xs={2} alignContent="center" justify="flex-start">
          <Counter />
        </Grid>
      </Grid>
      <Grid item container xs={12} sm={4} alignContent="center" justify="flex-end">
        <Speed />
      </Grid>
    </Grid>
  );
}

export default Controls;
