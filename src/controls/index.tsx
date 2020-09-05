import React, { useContext } from 'react';
import { Grid } from '@material-ui/core';

import { gameDataContext } from '../GameDataProvider';
import { clockContext } from '../ClockProvider';
import GameSelect from './GameSelect';
import PlayPauseButton from './PlayPauseButton';
import Speed from './Speed';
import RewindButton from './RewindButton';
import SkipBackButton from './SkipBackButton';
import FastForwardButton from './FastForwardButton';
import SkipForwardButton from './SkipForwardButton';

function Controls() {
  const { turnCount } = useContext(gameDataContext);
  const { dawdle, dawdling, turnNumber } = useContext(clockContext);

  return (
    <>
      <Grid item container alignContent="center" xs={12} sm={4}>
        <GameSelect />
      </Grid>
      <Grid item container xs={12} sm={4} alignContent="center" justify="center">
        <SkipBackButton />
        <RewindButton />
        <PlayPauseButton turnCount={turnCount} />
        <FastForwardButton />
        <SkipForwardButton />
        {turnNumber + 1}/{turnCount}
      </Grid>
      <Grid item container xs={12} sm={4} alignContent="center">
        <Speed dawdling={dawdling} dawdle={dawdle} />
      </Grid>
    </>
  );
}

export default Controls;
