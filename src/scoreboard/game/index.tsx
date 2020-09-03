import React from 'react';
import { Card, Grid } from '@material-ui/core';

import Bases from './Bases';
import BallStrikeOut from './BallStrikeOut';
import InningIndicator from './InningIndicator';
import { isAbomination } from '../../lib/play-utils';
import { GamePlayType, TeamStandingsType } from '../../types';
import styles from './index.module.scss';

function strikesForOut({ awayStrikes, homeStrikes, topOfInning }: GamePlayType) {
  return (topOfInning ? awayStrikes : homeStrikes);
}

interface Props {
  awayTeamStandings: TeamStandingsType,
  homeTeamStandings: TeamStandingsType,
  play: GamePlayType,
}

function Game({ awayTeamStandings, homeTeamStandings, play }: Props) {
  return (
    <Grid item container direction="column" className={styles.scorecard}>
      <Grid item container>
        <Grid item container direction="column" xs={12} md={7} className={styles.teams}>
          <Grid item container alignContent="center" className={styles.inning}>
            <Grid item container xs={6} alignContent="center">
              <InningIndicator play={play} />
            </Grid>
            <Grid item xs={5} />
            <Grid item container xs={1} alignContent="center" justify="flex-end">
              {isAbomination(play) ? '*' : null}
            </Grid>
          </Grid>
          <Grid item container className={styles.away} style={{ borderColor: play.awayTeamColor }}>
            <Grid item container xs={11} alignContent="center" justify="flex-start">
              <Grid item xs={2} className={styles.awayteamlogo} style={{ backgroundColor: play.awayTeamColor }}>
                {String.fromCodePoint(parseInt(play.awayTeamEmoji))}
              </Grid>
              <Grid item xs={2} container direction="column">
                <Grid item className={styles.teamrecord}>
                  {awayTeamStandings.w}-{awayTeamStandings.l}
                </Grid>
                <Grid item className={play.awayOdds >= 0.5 ? styles.goododds : styles.badodds}>
                  {Math.round(play.awayOdds * 100)}%
                </Grid>
              </Grid>
              <Grid item xs={8} alignContent="center">
                {play.awayTeamNickname}
              </Grid>
            </Grid>
            <Grid item xs={1} container className={styles.score} alignContent="center" justify="flex-end">
              {play.awayScore}
            </Grid>
          </Grid>
          <Grid item container className={styles.home} style={{ borderColor: play.homeTeamColor }}>
            <Grid item container xs={11} alignContent="center" justify="flex-start">
              <Grid item xs={2} className={styles.hometeamlogo} style={{ backgroundColor: play.homeTeamColor }}>
                {String.fromCodePoint(parseInt(play.homeTeamEmoji))}
              </Grid>
              <Grid item xs={2} container direction="column">
                <Grid item className={play.homeOdds >= 0.5 ? styles.goododds : styles.badodds}>
                  {Math.round(play.homeOdds * 100)}%
                </Grid>
                <Grid item className={styles.teamrecord}>
                  {homeTeamStandings.w}-{homeTeamStandings.l}
                </Grid>
              </Grid>
              <Grid item xs={8} alignContent="center">
                {play.homeTeamNickname}
              </Grid>
            </Grid>
            <Grid item xs={1} container className={styles.score} alignContent="center" justify="flex-end">
              {play.homeScore}
            </Grid>
          </Grid>
        </Grid>
        <Grid item container xs={12} md={5} alignContent="center" justify="center" className={styles.atbat}>
          <Grid item container xs={4} md={6} alignContent="center" justify="center">
            <Bases baseRunners={play.baseRunners} basesOccupied={play.basesOccupied} />
          </Grid>
          <Grid item container xs={8} md={6} direction="column">
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
  );
}

export default Game;
