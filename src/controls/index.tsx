import React, { ChangeEvent, useState } from 'react';
import { Grid } from '@material-ui/core';

import GameSelect from './GameSelect';
import PlayPauseButton from './PlayPauseButton';
import Speed from './Speed';
import { GameDataType, GameMetaDataType } from '../types';
import styles from './index.module.scss';

interface Props {
  day: string,
  dawdle: (val: number) => void,
  dawdling: number,
  gameIndex: GameMetaDataType,
  playing: boolean,
  playBall: (val: boolean) => void,
  setDay: (val: string) => void,
  setSeason: (val: string) => void,
  turn: GameDataType,
  turnNumber: number,
  season: string,
}


function Controls({ dawdle, dawdling, gameIndex, playing, playBall, turn, turnNumber, day, season, setSeason, setDay }: Props) {

  return (
    <>
      <Grid item container alignContent="center" xs={12} sm={5}>
        <GameSelect gameIndex={gameIndex} day={day} setDay={setDay} season={season} setSeason={setSeason} />
      </Grid>
      <Grid item container xs={12} sm={2} alignContent="center" justify="center">
        <PlayPauseButton playing={playing} playBall={playBall} />
      </Grid>
      <Grid item container xs={12} sm={5} alignContent="center">
        <Speed dawdling={dawdling} dawdle={dawdle} />
      </Grid>
    </>
  );
}

export default Controls;
