import React from 'react';
import { Card, Grid } from '@material-ui/core';

import Bases from './Bases';
import BallStrikeOut from './BallStrikeOut';
import InningIndicator from './InningIndicator';
import { GameTurnType } from '../../types';
import styles from './index.module.scss';

function strikesForOut({ awayStrikes, homeStrikes, topOfInning }: GameTurnType) {
  return (topOfInning ? awayStrikes : homeStrikes);
}

interface Props {
  abominable: boolean,
  play: GameTurnType,
}

function Game({ abominable, play }: Props) {
  return (
    <Grid item container direction="column" className={styles.scorecard}>
      <Grid item container>
        <Grid item container direction="column" xs={12} md={7} className={styles.teams}>
          <Grid item container alignContent="center" className={styles.inning}>
            <Grid item container xs={4} alignContent="center">
              <InningIndicator play={play} />
            </Grid>
            <Grid item xs={7} />
            <Grid item container xs={1} alignContent="center" justify="flex-end">
              {abominable ? '*' : null}
            </Grid>
          </Grid>
          <Grid item container className={styles.away} style={{ borderColor: play.awayTeamColor }}>
            <Grid item container xs={11} alignContent="center" justify="flex-start">
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
          <Grid item xs={6}>
            <Grid container direction="column">
              <BallStrikeOut
                balls={play.atBatBalls}
                outs={play.halfInningOuts}
                strikes={play.atBatStrikes}
                strikesForOut={strikesForOut(play)}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item container alignContent="center" justify="flex-end" className={styles.lastupdate}>
        {play.lastUpdate}
      </Grid>
    </Grid>
  );
}

export default Game;
