import React from 'react';
import { Grid } from '@material-ui/core';
import styles from './Bases.module.scss';

function Base({ runner }) {
  if (runner) {
    return (<div className={styles.base}>&#x25c6;</div>);
  } else {
    return (<div className={styles.base}>&#x25c7;</div>);
  }
}

function HomePlate() {
  return (<div className={styles.homeplate}>&#x2302;</div>);
}

function Bases({ runners }) {
  return (
    <Grid container direction="column" className={styles.diamond}>
      <Grid item container justify="center" className={styles.tier}>
        <Grid item xs={3} />
        <Grid item xs={3}>
          <Base runner={runners?.[1]} />
        </Grid>
        <Grid item xs={3} />
      </Grid>
      <Grid item container justify="center" className={styles.tier}>
        <Grid item xs={3}>
          <Base runner={runners?.[2]} />
        </Grid>
        <Grid item xs={3} />
        <Grid item xs={3}>
          <Base runner={runners?.[0]} />
        </Grid>
      </Grid>
      <Grid item container justify="center" className={styles.tier}>
        <Grid item xs={3} />
        <Grid item xs={3}><HomePlate /></Grid>
        <Grid item xs={3} />
      </Grid>
    </Grid >
  );
}

export default Bases;
