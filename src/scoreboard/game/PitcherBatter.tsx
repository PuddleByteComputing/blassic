import React from 'react';
import { Grid } from '@material-ui/core';
import { GamePlayType } from '../../types/';
import styles from './PitcherBatter.module.scss';

interface Props {
  play: GamePlayType,
}

function PitcherBatter({ play }: Props) {
  return (
    <Grid item container className={styles.pitcherbatter}>
      <Grid item container xs={5} alignContent="center" justify="flex-end"
        className={styles.pname}
      >
        {play.topOfInning ? play.homePitcherName : play.awayPitcherName}
      </Grid>
      <Grid item container xs={1} alignContent="center" justify="center"
        className={styles.plabel}
        style={{ borderColor: play.topOfInning ? play.homeTeamColor : play.awayTeamColor }}
      >
        P
      </Grid>
      <Grid item container xs={1} alignContent="center" justify="center"
        className={styles.ablabel}
        style={{ borderColor: play.topOfInning ? play.awayTeamColor : play.homeTeamColor }}
      >
        AB
      </Grid>
      <Grid item container xs={5} alignContent="center" justify="flex-start"
        className={styles.abname}
      >
        {play.topOfInning ? play.awayBatterName : play.homeBatterName}
      </Grid>
    </Grid>
  );
}

export default PitcherBatter;
