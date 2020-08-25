import React from 'react';
import { Card, Grid } from '@material-ui/core';
import styles from './Score.module.scss';
import Bases from './scorecard/Bases';

function Score({ play }) {
  return (
    <Card className={styles.scorecard}>
      <Grid container direction="column">
        <Grid item container>
          <Grid item container direction="column" xs={7}>
            <Grid item container>
              <Grid item xs={11} container alignContent="center" justify="flex-start" className={styles.team} style={{ borderLeft: `5px solid ${play.awayTeamColor}` }}>
                {play.awayTeamNickname} &nbsp;
                <span style={{ backgroundColor: play.awayTeamColor }}>
                  {String.fromCodePoint(parseInt(play.awayTeamEmoji))}
                </span>
              </Grid>
              <Grid item xs={1} container className={styles.score} alignContent="center" justify="flex-end">
                {play.awayScore}
              </Grid>
            </Grid>
            <Grid item container>
              <Grid item xs={11} container alignContent="center" justify="flex-start" className={styles.team} style={{ borderLeft: `5px solid ${play.homeTeamColor}` }}>
                {play.homeTeamNickname} &nbsp;
                <span style={{ backgroundColor: play.homeTeamColor }}>
                  {String.fromCodePoint(parseInt(play.homeTeamEmoji))}
                </span>
              </Grid>
              <Grid item xs={1} container className={styles.score} alignContent="center" justify="flex-end">
                {play.homeScore}
              </Grid>
            </Grid>
          </Grid>
          <Grid item container direction="column" xs={2} justify="center">
            <Grid item container>
              <Grid item xs={6} className={styles.bso}>
                B
              </Grid>
              <Grid item xs={6}>
                {play.atBatBalls}
              </Grid>
            </Grid>
            <Grid item container>
              <Grid item xs={6} className={styles.bso}>
                S
              </Grid>
              <Grid item xs={6}>
                {play.atBatStrikes}
              </Grid>
            </Grid>
            <Grid item container>
              <Grid item xs={6} className={styles.bso}>
                O
              </Grid>
              <Grid item xs={6}>
                {play.halfInningOuts}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <Bases runners={play.baseRunners} />
          </Grid>
        </Grid>
        <Grid item container alignContent="center" justify="flex-end" className={styles.lastUpdate}>
          {play.lastUpdate}
        </Grid>
      </Grid>
    </Card >
  );
}

export default Score;
