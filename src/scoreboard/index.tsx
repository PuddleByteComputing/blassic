import React from 'react';
import { Grid } from '@material-ui/core';
import Game from './game';
import { GameDataType } from '../types';

interface Props {
  streaming: string,
  turn: GameDataType
}

function ScoreBoard({ streaming, turn }: Props) {
  const schedule = turn?.schedule;

  if (!schedule) {
    if (streaming) {
      return (
        <Grid container alignContent="center" justify="center">
          Loading game {streaming}
        </Grid>
      );
    }
    return (
      <Grid container alignContent="center" justify="center">
        Select a Season and Day of Blaseball to replay
      </Grid>
    );
  }

  return (
    <Grid container spacing={2} justify="center">
      {schedule.map((play, idx) => (
        <Grid item xs={12} md={6} key={idx}>
          <Game play={play} />
        </Grid>
      ))}
    </Grid>
  );

}

export default ScoreBoard;
