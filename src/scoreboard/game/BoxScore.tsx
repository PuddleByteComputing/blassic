import React, { useContext } from 'react';
import { Grid } from '@material-ui/core';
import { gameDataContext, GameStatsType } from '../../GameDataProvider';
import { GamePlayType } from '../../types';
import styles from './BoxScore.module.scss';

const displayInnings = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // We love you, javascript.
function inningStyle(inning: number) {
  if (inning % 3 === 2) {
    return styles.endtrypt;
  }

  if (inning && (inning % 3 === 0)) {
    return styles.starttrypt;
  }

  return styles.midtrypt;
}

// NOTES:
//  - InningStatsType[gameId][0] is stats at start of game,
//    inningStatsType[gameId][1] is stats at end of 1st inning,
//    ...etc
//  - the home team UUID is the gameId for InningStatType

const ongoingInningScore = (half: 0 | 1, play: GamePlayType) =>
  play[half ? 'homeScore' : 'awayScore'];

const extraInningScore = (half: 0 | 1, stats: GameStatsType) =>
  stats[stats.length - 1][half]?.score;

const completedInningScore = (inning: number, half: 0 | 1, stats: GameStatsType) =>
  (inning > 8) ? extraInningScore(half, stats) : stats[inning + 1][half]?.score;

const previousInningScore = (inning: number, half: 0 | 1, stats: GameStatsType) =>
  (inning > 8)
    ? stats[9][half]?.score
    : stats[inning]?.[half]?.score;

const shameAdjustment = (inning: number, half: 0 | 1, stats: GameStatsType) =>
  inning === 0 ? (stats[0]?.[half]?.shamePit || 0) : 0;

// First inning halves can start with various effects or announcements before the first pitch
const noBattersYet = (play: GamePlayType, half: 0 | 1) =>
  play[half === 0 ? 'awayTeamBatterCount' : 'homeTeamBatterCount'] < 0;

function inningRuns(play: GamePlayType, inning: number, half: 0 | 1, stats: GameStatsType): string {
  //       - inning is zero-indexed, as in gameData
  if (!stats) { return '?' }
  if (noBattersYet(play, half)) { return '' }

  const isOngoingInningHalf = (inning === play.inning) && ((half === 0) === play.topOfInning);

  const score = (inning === 9 || isOngoingInningHalf)
    ? ongoingInningScore(half, play)
    : completedInningScore(inning, half, stats);

  return ((score || 0)
    - (previousInningScore(inning, half, stats) || 0)
    - shameAdjustment(inning, half, stats)).toString();
}

interface Props {
  play: GamePlayType,
}

function BoxScore({ play }: Props) {
  const { getGameStats } = useContext(gameDataContext);
  const stats = getGameStats(play.homeTeam);

  return (
    <Grid item container direction="column" className={styles.root}>
      <Grid item container className={styles.awayline}>
        <Grid item container xs={1} alignContent="center" justify="flex-end">
          {stats[0]?.[0]?.shamePit
            ? <span className={styles.shamepit}>{stats[0][0].shamePit}</span>
            : ''}
        </Grid>
        {displayInnings.map((inning) =>
          <Grid item container xs={1} alignContent="center" justify="center"
            key={`t${inning}`}
            className={inningStyle(inning)}
          >
            {inning > play.inning ? <span>&nbsp;</span> : inningRuns(play, inning, 0, stats)}
          </Grid>
        )}
        <Grid item xs={1} />
      </Grid>
      <Grid item container className={styles.homeline}>
        <Grid item container xs={1} alignContent="center" justify="flex-end">
          {stats[0]?.[1]?.shamePit
            ? <span className={styles.shamepit}>{stats[0][1].shamePit}</span>
            : ''}
        </Grid>
        {displayInnings.map((inning) =>
          <Grid item container xs={1} alignContent="center" justify="center"
            key={`b${inning}`}
            className={inningStyle(inning)}
          >
            {inning > play.inning || (inning === play.inning && play.topOfInning)
              ? <span>&nbsp;</span>
              : inningRuns(play, inning, 1, stats)}
          </Grid>
        )}
        <Grid item xs={1} />
      </Grid>
    </Grid >
  );
}

export default BoxScore;
