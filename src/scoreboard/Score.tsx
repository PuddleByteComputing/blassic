import React from 'react';
import { Card, Grid } from '@material-ui/core';
import styles from './Score.module.scss';
import Bases from './scorecard/Bases';
import BallStrikeOut from './scorecard/BallStrikeOut';
import InningIndicator from './InningIndicator';
import { GameTurnType } from '../lib/blaseball-api-types';

function strikesForOut({ awayStrikes, homeStrikes, topOfInning }: GameTurnType) {
  return (topOfInning ? awayStrikes : homeStrikes);
}

interface Props {
  play: GameTurnType,
}

function ScoreCard({ play }: Props) {
  return (
    <Card className={styles.scorecard}>
      <Grid container direction="column">
        <Grid item container>
          <Grid item container direction="column" xs={12} md={7} className={styles.teams}>
            <Grid item container alignContent="center" className={styles.inning}>
              <InningIndicator play={play} />
            </Grid>
            <Grid item container className={styles.away} style={{ borderColor: play.awayTeamColor }}>
              <Grid item container xs={11} alignContent="center" justify="flex-start" className={styles.teamname}>
                <div style={{ backgroundColor: play.awayTeamColor }} className={styles.awayteamlogo}>
                  {String.fromCodePoint(parseInt(play.awayTeamEmoji))}
                </div>
                {play.awayTeamNickname} &nbsp;
                <div className={styles.odds}>{Math.round(play.awayOdds * 100)}%</div>
              </Grid>
              <Grid item xs={1} container className={styles.score} alignContent="center" justify="flex-end">
                {play.awayScore}
              </Grid>
            </Grid>
            <Grid item container className={styles.home} style={{ borderColor: play.homeTeamColor }}>
              <Grid item container xs={11} alignContent="center" justify="flex-start">
                <div style={{ backgroundColor: play.homeTeamColor }} className={styles.hometeamlogo}>
                  {String.fromCodePoint(parseInt(play.homeTeamEmoji))}
                </div>
                {play.homeTeamNickname} &nbsp;
                <span className={styles.odds}>{Math.round(play.homeOdds * 100)}%</span>
              </Grid>
              <Grid item xs={1} container className={styles.score} alignContent="center" justify="flex-end">
                {play.homeScore}
              </Grid>
            </Grid>
          </Grid>
          <Grid item container xs={12} md={5} alignContent="center" justify="center" className={styles.atbat}>
            <Grid item container xs={6} alignContent="center" justify="center">
              <Bases baseRunners={play.baseRunners} basesOccupied={play.basesOccupied} />
            </Grid>
            <Grid item container xs={6} direction="column" justify="flex-end">
              <BallStrikeOut
                balls={play.atBatBalls}
                outs={play.halfInningOuts}
                strikes={play.atBatStrikes}
                strikesForOut={strikesForOut(play)}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item container alignContent="center" justify="flex-end" className={styles.lastupdate}>
          {play.lastUpdate}
        </Grid>
      </Grid>
    </Card >
  );
}

export default ScoreCard;
