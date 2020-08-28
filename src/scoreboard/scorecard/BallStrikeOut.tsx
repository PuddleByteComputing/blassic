import React from 'react';
import { Grid } from '@material-ui/core';
import styles from './BallStrikeOut.module.scss';

interface PipsProps {
  count?: number,
  max: number,
}

function Pips({ count, max }: PipsProps) {
  const num = count ? count : 0;
  return (
    <span>
      {Array(num + 1).join("\u25CF")}
      {Array(max - num + 1).join("\u25CB")}
    </span>
  );
}

interface Props {
  balls: number,
  strikes: number,
  strikesForOut: number,
  outs: number,
}

function BallStrikeOut({ balls, outs, strikes, strikesForOut }: Props) {
  return (
    <Grid item container direction="column" xs={2} justify="center" className={styles.bso}>
      <Grid item container>
        <Grid container item xs={4} justify="center" className={styles.label}>
          B
        </Grid>
        <Grid container item xs={8} alignContent="center" justify="flex-start">
          <Pips count={balls} max={4} />
        </Grid>
      </Grid>
      <Grid item container>
        <Grid container item xs={4} justify="center" className={styles.label}>
          S
        </Grid>
        <Grid container item xs={8} justify="flex-start">
          <Pips count={strikes} max={strikesForOut} />
        </Grid>
      </Grid>
      <Grid item container>
        <Grid container item xs={4} justify="center" className={styles.label}>
          O
        </Grid>
        <Grid container item xs={8} justify="flex-start">
          <Pips count={outs} max={3} />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default BallStrikeOut;
