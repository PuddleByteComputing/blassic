import React from 'react';
import { Card, Grid } from '@material-ui/core';
import styles from './Score.module.scss';
import Bases from './scorecard/Bases';
import BallStrikeOut from './scorecard/BallStrikeOut';
import { GameTurnType } from '../lib/blaseball-api-types';

function strikesForOut({ awayStrikes, homeStrikes, topOfInning }: GameTurnType) {
  return (topOfInning ? awayStrikes : homeStrikes);
}

interface Props {
  play: GameTurnType
}

function Score({ play }: Props) {
  const awayTeamStyle = { borderColor: play.awayTeamColor };

  return (
    <Card className={styles.scorecard}>
      <Grid container direction="column">
        <Grid item container>
          <Grid item container direction="column" xs={8} className={styles.teams}>
            <Grid item container className={styles.away} style={awayTeamStyle}>
              <Grid item container xs={11} alignContent="center" justify="flex-start" className={styles.teamname}>
                <div style={{ backgroundColor: play.awayTeamColor }} className={styles.teamlogo}>
                  {String.fromCodePoint(parseInt(play.awayTeamEmoji))}
                </div>
                {play.awayTeamNickname} &nbsp;
              </Grid>
              <Grid item xs={1} container className={styles.score} alignContent="center" justify="flex-end">
                {play.awayScore}
              </Grid>
            </Grid>
            <Grid item container className={styles.home} style={{ borderColor: play.homeTeamColor }}>
              <Grid item container xs={11} alignContent="center" justify="flex-start" className={styles.teamname}>
                <div style={{ backgroundColor: play.homeTeamColor }} className={styles.teamlogo}>
                  {String.fromCodePoint(parseInt(play.homeTeamEmoji))}
                </div>
                {play.homeTeamNickname} &nbsp;
              </Grid>
              <Grid item xs={1} container className={styles.score} alignContent="center" justify="flex-end">
                {play.homeScore}
              </Grid>
            </Grid>
          </Grid>
          <Grid item container xs={2} alignContent="center" justify="center">
            <Bases baseRunners={play.baseRunners} basesOccupied={play.basesOccupied} />
          </Grid>
          <BallStrikeOut
            balls={play.atBatBalls}
            outs={play.halfInningOuts}
            strikes={play.atBatStrikes}
            strikesForOut={strikesForOut(play)}
          />
        </Grid>
        <Grid item container alignContent="center" justify="flex-end" className={styles.lastUpdate}>
          {play.lastUpdate}
        </Grid>
      </Grid>
    </Card >
  );
}

export default Score;
