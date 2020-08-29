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
    <>
      {Array(num + 1).join("\u25CF")}
      {Array(max - num + 1).join("\u25CB")}
    </>
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
    <>
      <Grid item container>
        <Grid container item xs={4} alignContent="center" justify="flex-start" className={styles.label}>
          Ball
        </Grid>
        <Grid container item xs={8} alignContent="center" justify="flex-start" className={styles.pips}>
          <Pips count={balls} max={4} />
        </Grid>
      </Grid>
      <Grid item container>
        <Grid container item xs={4} alignContent="center" justify="flex-start" className={styles.label}>
          Strike
        </Grid>
        <Grid container item xs={8} alignContent="center" justify="flex-start" className={styles.pips}>
          <Pips count={strikes} max={strikesForOut} />
        </Grid>
      </Grid>
      <Grid item container>
        <Grid container item xs={4} alignContent="center" justify="flex-start" className={styles.label}>
          Out
        </Grid>
        <Grid container item xs={8} alignContent="center" justify="flex-start" className={styles.pips}>
          <Pips count={outs} max={3} />
        </Grid>
      </Grid>
    </>
  );
}

export default BallStrikeOut;
