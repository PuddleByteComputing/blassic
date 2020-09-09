import React, { useContext } from 'react';
import { Grid } from '@material-ui/core';
import { gameDataContext, InningStatsType } from '../../GameDataProvider';
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

function inningRuns(play: GamePlayType, inningNum: number, top: boolean, inningStats: InningStatsType): number {
  const gameStats = inningStats[play.homeTeam];

  const score = (inningNum === 9 || ((inningNum === play.inning) && (top === play.topOfInning)))
    ? play[top ? 'awayScore' : 'homeScore']
    : (inningNum > 8)
      ? gameStats[gameStats.length - 1][top ? 0 : 1]?.score || 0
      : gameStats[inningNum][top ? 0 : 1]?.score || 0;

  const prevScore = (inningNum === 0)
    ? 0
    : (inningNum > 8)
      ? gameStats[8][top ? 0 : 1]?.score || 0
      : gameStats[inningNum - 1][top ? 0 : 1]?.score || 0;

  return score - prevScore;
}

interface Props {
  play: GamePlayType,
}

function BoxScore({ play }: Props) {
  const { inningStats } = useContext(gameDataContext);

  return (
    <Grid item container direction="column" className={styles.root}>
      <Grid item container className={styles.awayline}>
        <Grid item xs={2} />
        {displayInnings.map((inning) =>
          <Grid item container xs={1} alignContent="center" justify="center"
            key={`t${inning}`}
            className={inningStyle(inning)}
          >
            {inning > play.inning ? <span>&nbsp;</span> : inningRuns(play, inning, true, inningStats)}
          </Grid>
        )}
      </Grid>
      <Grid item container className={styles.homeline}>
        <Grid item xs={2} />
        {displayInnings.map((inning) =>
          <Grid item container xs={1} alignContent="center" justify="center"
            key={`b${inning}`}
            className={inningStyle(inning)}
          >
            {inning > play.inning || (inning === play.inning && play.topOfInning)
              ? <span>&nbsp;</span>
              : inningRuns(play, inning, false, inningStats)}
          </Grid>
        )}
      </Grid>
    </Grid >
  );
}

export default BoxScore;
