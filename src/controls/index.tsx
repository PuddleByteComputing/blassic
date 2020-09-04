import React from 'react';
import { Grid } from '@material-ui/core';

import GameSelect from './GameSelect';
import PlayPauseButton from './PlayPauseButton';
import Speed from './Speed';
import RewindButton from './RewindButton';
import { GameDataType, GameMetaDataType } from '../types';

import { IconButton } from '@material-ui/core';
import { FastForward, FastRewind, SkipNext, SkipPrevious } from '@material-ui/icons';

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
  day: string,
  dawdle: (val: number) => void,
  dawdling: number,
  gameIndex: GameMetaDataType,
  playing: boolean,
  playBall: (val: boolean) => void,
  setDay: (val: string) => void,
  setSeason: (val: string) => void,
  turns: GameDataType[],
  turnNumber: number,
  season: string,
  setTurnNumber: (val: number) => void,
}

function Controls({
  dawdle,
  dawdling,
  gameIndex,
  playing,
  playBall,
  day,
  season,
  setSeason,
  setDay,
  setTurnNumber,
  turnNumber,
  turns
}: Props) {
  return (
    <>
      <Grid item container alignContent="center" xs={12} sm={4}>
        <GameSelect gameIndex={gameIndex} day={day} setDay={setDay} season={season} setSeason={setSeason} />
      </Grid>
      <Grid item container xs={12} sm={4} alignContent="center" justify="center">
        <SkipBackButton />
        <RewindButton playing={playing} setTurnNumber={setTurnNumber} turnNumber={turnNumber} />
        <PlayPauseButton
          playing={playing}
          playBall={playBall}
          setTurnNumber={setTurnNumber}
          turnNumber={turnNumber}
          turns={turns}
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
