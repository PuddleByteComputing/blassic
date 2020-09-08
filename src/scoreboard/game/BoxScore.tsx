import React from 'react';
import { Grid } from '@material-ui/core';
import styles from './BoxScore.module.scss';

function BoxScore() {
  return (
    <Grid item container direction="column" className={styles.root}>
      <Grid item container className={styles.awayline}>
        <Grid item xs={2} />
        <Grid item container xs={1} alignContent="center" justify="center" className={styles.midtrypt}>
          1
        </Grid>
        <Grid item container xs={1} alignContent="center" justify="center" className={styles.midtrypt}>
          2
        </Grid>
        <Grid item container xs={1} alignContent="center" justify="center" className={styles.endtrypt}>
          3
        </Grid>
        <Grid item container xs={1} alignContent="center" justify="center" className={styles.starttrypt}>
          4
        </Grid>
        <Grid item container xs={1} alignContent="center" justify="center" className={styles.midtrypt}>
          5
        </Grid>
        <Grid item container xs={1} alignContent="center" justify="center" className={styles.endtrypt}>
          6
        </Grid>
        <Grid item container xs={1} alignContent="center" justify="center" className={styles.starttrypt}>
          7
        </Grid>
        <Grid item container xs={1} alignContent="center" justify="center" className={styles.midtrypt}>
          8
        </Grid>
        <Grid item container xs={1} alignContent="center" justify="center" className={styles.endtrypt}>
          9
        </Grid>
        <Grid item container xs={1} alignContent="center" justify="center" className={styles.starttrypt}>
          20
        </Grid>
      </Grid>
      <Grid item container className={styles.homeline}>
        <Grid item xs={2} />
        <Grid item container xs={1} alignContent="center" justify="center" className={styles.midtrypt}>
          1
        </Grid>
        <Grid item container xs={1} alignContent="center" justify="center" className={styles.midtrypt}>
          2
        </Grid>
        <Grid item container xs={1} alignContent="center" justify="center" className={styles.endtrypt}>
          3
        </Grid>
        <Grid item container xs={1} alignContent="center" justify="center" className={styles.starttrypt}>
          4
        </Grid>
        <Grid item container xs={1} alignContent="center" justify="center" className={styles.midtrypt}>
          5
        </Grid>
        <Grid item container xs={1} alignContent="center" justify="center" className={styles.endtrypt}>
          6
        </Grid>
        <Grid item container xs={1} alignContent="center" justify="center" className={styles.starttrypt}>
          7
        </Grid>
        <Grid item container xs={1} alignContent="center" justify="center" className={styles.midtrypt}>
          8
        </Grid>
        <Grid item container xs={1} alignContent="center" justify="center" className={styles.endtrypt}>
          9
        </Grid>
        <Grid item container xs={1} alignContent="center" justify="center" className={styles.starttrypt}>
          10
        </Grid>
      </Grid>
    </Grid>
  );
}

export default BoxScore;
