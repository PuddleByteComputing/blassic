import React from 'react'
import { Grid, IconButton, Paper } from '@material-ui/core';
import { PlayCircleFilled, PauseCircleFilled } from '@material-ui/icons';
import styles from './PlaybackControls.module.scss';

function PauseButton({ playing, playBall }) {
  if (playing) {
    return (
      <IconButton
        className={styles.pause}
        onClick={(event) => { event.stopPropagation(); playBall(false) }}
        onFocus={(event) => event.stopPropagation()}
      >
        <PauseCircleFilled />
      </IconButton>
    );
  } else {
    return (
      <IconButton
        className={styles.pause}
        onClick={(event) => { event.stopPropagation(); playBall(true) }}
        onFocus={(event) => event.stopPropagation()}
      >
        <PlayCircleFilled />
      </IconButton>
    );
  }
}

function PlaybackControls({ dawdling, fussing, playing, playBall, turn, turnNumber }) {
  return (
    <Paper className={styles.paper}>
      <Grid container>
        <Grid item container alignContent="center" justify="flex-start" xs={4}>
          Season {turn?.season?.seasonNumber || '???'},
          day {turn?.schedule?.[0]?.day || '???'},
          turn {turnNumber}
        </Grid>
        <Grid item container alignContent="center" justify="center" xs={4}>
          <PauseButton playing={playing} playBall={playBall} />
        </Grid>
        <Grid item container alignContent="center" justify="flex-end" xs={4}>
          Dawdle: {dawdling} Fuss: {fussing}
        </Grid>
      </Grid>
    </Paper>
  );
}

export default PlaybackControls;
