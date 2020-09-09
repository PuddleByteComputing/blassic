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
  count: number,
  label: string,
  max: number,
}

function BallStrikeOut({ count, label, max }: Props) {
  return (
    <Grid item container>
      <Grid container item xs={4} alignContent="center" justify="flex-start" className={styles.label}>
        {label}
      </Grid>
      <Grid item xs={2} />
      <Grid container item xs={6} alignContent="center" justify="flex-end" className={styles.pips}>
        <Pips count={count} max={max} />
      </Grid>
    </Grid>
  );
}

export default BallStrikeOut;
