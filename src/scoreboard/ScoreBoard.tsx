import React from 'react';
import { Card, Grid } from '@material-ui/core'
import Score from './Score';

function ScoreBoard({ turn }) {
  const schedule = turn?.schedule;

  if (!schedule) {
    return <Card>No Games</Card>
  } else {
    // schedule.map(play => console.log(play));
  }

  return (
    <Grid container spacing={2} justify="center">
      {schedule.map(play => (
        <Grid item key={play._id}>
          <Score play={play} />
        </Grid>
      ))}
    </Grid>
  );

}

export default ScoreBoard;
