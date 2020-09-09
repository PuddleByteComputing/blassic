import React from 'react';
import { Grid } from '@material-ui/core';

import Bases from './Bases';
import BallStrikeOut from './BallStrikeOut';
import InningIndicator from './InningIndicator';
import BoxScore from './BoxScore';
import TeamScore from './TeamScore';
import PitcherBatter from './PitcherBatter';
import PlayByPlay from './PlayByPlay';
import { isAbomination } from '../../lib/play-utils';
import { GamePlayType, StandingsMapType } from '../../types';
import styles from './index.module.scss';

function strikesForOut({ awayStrikes, homeStrikes, topOfInning }: GamePlayType) {
  return (topOfInning ? awayStrikes : homeStrikes);
}

interface Props {
  play: GamePlayType,
  standings: StandingsMapType,
}

function Game({ play, standings }: Props) {
  return (
    <Grid item container direction="column" className={styles.scorecard}>
      <Grid item container className={styles.inning}>
        <Grid item container xs={6} alignContent="center">
          <InningIndicator play={play} />
        </Grid>
        <Grid item xs={5} />
        <Grid item container xs={1} alignContent="center" justify="flex-end">
          <span className={styles.abomination}>{isAbomination(play) ? '*' : null}</span>
        </Grid>
      </Grid>
      <Grid item container>
        <Grid item container direction="column" xs={12} md={7} className={styles.teams}>
          <TeamScore play={play} standings={standings} />
          <TeamScore home play={play} standings={standings} />
          {play.gameComplete ? null :
            <>
              <PitcherBatter play={play} />
              <Grid item container className={styles.visualization}>
                <Grid item container xs={4} md={6} alignContent="center" justify="center">
                  <Bases baseRunners={play.baseRunners} basesOccupied={play.basesOccupied} />
                </Grid>
                <Grid item container xs={8} md={6} direction="column">
                  <BallStrikeOut label="Balls" count={play.atBatBalls} max={4} />
                  <BallStrikeOut label="Strikes" count={play.atBatStrikes} max={strikesForOut(play)} />
                  <BallStrikeOut label="Outs" count={play.halfInningOuts} max={3} />
                </Grid>
              </Grid>
            </>}
        </Grid>
        <Grid item container xs={12} md={5} direction="column">
          <Grid item container>
            <BoxScore play={play} />
          </Grid>
          {play.gameComplete ? null :
            <Grid item container alignContent="center" justify="flex-start" className={styles.lastupdate}>
              <PlayByPlay teamId={play.homeTeam} />
            </Grid>
          }
        </Grid>
      </Grid>
    </Grid >
  );
}

export default Game;
