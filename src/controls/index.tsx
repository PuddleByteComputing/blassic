import React, { useContext } from 'react';
import { Grid } from '@material-ui/core';

import { gameDataContext } from '../GameDataProvider';
import GameSelect from './GameSelect';
import PlayPauseButton from './PlayPauseButton';
import Speed from './Speed';
import RewindButton from './RewindButton';

import { IconButton } from '@material-ui/core';
import { FastForward, SkipNext, SkipPrevious } from '@material-ui/icons';

function SkipBackButton() {
  return (
    <IconButton
      onClick={(event) => { event.stopPropagation(); }}
      onFocus={(event) => event.stopPropagation()}
      size="small"
    >
      <SkipPrevious fontSize="small" color="primary" />
    </IconButton>
  );
}

function FastForwardButton() {
  return (
    <IconButton
      onClick={(event) => { event.stopPropagation(); }}
      onFocus={(event) => event.stopPropagation()}
      size="small"
    >
      <FastForward fontSize="small" />
    </IconButton >
  );
}

function SkipForwardButton() {
  return (
    <IconButton
      onClick={(event) => { event.stopPropagation(); }}
      onFocus={(event) => event.stopPropagation()}
      size="small"
    >
      <SkipNext fontSize="small" />
    </IconButton >
  );
}

interface Props {
  dawdle: (val: number) => void,
  dawdling: number,
  playing: boolean,
  playBall: (val: boolean) => void,
  setTurnNumber: (val: number) => void,
  turnNumber: number,
}

function Controls({
  dawdle,
  dawdling,
  playing,
  playBall,
  setTurnNumber,
  turnNumber,
}: Props) {
  const { turnCount } = useContext(gameDataContext);

  return (
    <>
      <Grid item container alignContent="center" xs={12} sm={4}>
        <GameSelect />
      </Grid>
      <Grid item container xs={12} sm={4} alignContent="center" justify="center">
        <SkipBackButton />
        <RewindButton playing={playing} setTurnNumber={setTurnNumber} turnNumber={turnNumber} />
        <PlayPauseButton
          playing={playing}
          playBall={playBall}
          setTurnNumber={setTurnNumber}
          turnNumber={turnNumber}
          turnCount={turnCount}
        />
        <FastForwardButton />
        <SkipForwardButton />
      </Grid>
      <Grid item container xs={12} sm={4} alignContent="center">
        <Speed dawdling={dawdling} dawdle={dawdle} />
      </Grid>
    </>
  );
}

export default Controls;
