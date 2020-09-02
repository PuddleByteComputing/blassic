import React from 'react';
import { Card, Grid } from '@material-ui/core';
import Game from './game';
import { GameDataType } from '../types';

interface Props {
  turn: GameDataType
}

function ScoreBoard({ turn }: Props) {
  const schedule = turn?.schedule;

  if (!schedule) {
    return (<Card>No Games</Card>);
  } else {
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
