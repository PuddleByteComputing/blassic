import React from 'react';
import { Grid } from '@material-ui/core';
import { GamePlayType, StandingsMapType } from '../../types';
import styles from './TeamScore.module.scss';

interface Props {
  home?: boolean,
  play: GamePlayType,
  standings: StandingsMapType,
}

function TeamScore({ home, play, standings }: Props) {
  const teamId = home ? play.homeTeam : play.awayTeam;
  const color = home ? play.homeTeamColor : play.awayTeamColor;
  const score = home ? play.homeScore : play.awayScore;
  const teamName = home ? play.homeTeamNickname : play.awayTeamNickname;
  const odds = home ? play.homeOdds : play.awayOdds;
  const rootClass = home ? styles.home : styles.away;
  const logoClass = home ? styles.hometeamlogo : styles.awayteamlogo;
  const emoji = String.fromCodePoint(parseInt(home ? play.homeTeamEmoji : play.awayTeamEmoji));

  return (
    <Grid item container className={rootClass} style={{ borderColor: color }}>
      <Grid item container xs={11} alignContent="center" justify="flex-start">
        <Grid item xs={2} className={logoClass} style={{ backgroundColor: color }}>
          {emoji}
        </Grid>
        <Grid item xs={2} container direction="column">
          <Grid item className={styles.teamrecord}>
            {standings[teamId]?.w}-{standings[teamId]?.l}
          </Grid>
          <Grid item className={odds >= 0.5 ? styles.goododds : styles.badodds}>
            {Math.round(100 * odds)}%
          </Grid>
        </Grid>
        <Grid item container xs={8} alignContent="center">
          {teamName}
        </Grid>
      </Grid>
      <Grid item xs={1} container className={styles.score} alignContent="center" justify="flex-end">
        {score}
      </Grid>
    </Grid>
  );
}

export default TeamScore;
