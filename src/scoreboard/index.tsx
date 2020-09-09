import React, { useContext, useEffect, useState } from 'react';
import { Grid, Hidden } from '@material-ui/core';
import { useTheme } from '@material-ui/styles';
import { gameDataContext } from '../GameDataProvider';
import { clockContext } from '../ClockProvider';
import Game from './game';
import { league, subleagues, teamSubleagueId } from '../lib/leagues';
import { mapTeamsToStandings, playComparator } from '../lib/gamedata-utils';
import { isAbomination } from '../lib/play-utils';
import { StandingsMapType } from '../types';
import styles from './index.module.scss';

function ScoreBoard() {
  const { turnNumber } = useContext(clockContext);
  const { season, turnsRef } = useContext(gameDataContext);
  const theme = useTheme();
  console.log(theme);
  const turn = turnsRef.current[turnNumber];
  const initialStandingsMap = {} as StandingsMapType;
  const [standingsMap, updateStandings] = useState(initialStandingsMap);
  const remapStandings = () =>
    updateStandings(turnsRef.current[0] ? mapTeamsToStandings(turnsRef.current[0]) : initialStandingsMap);
  useEffect(remapStandings, [turnsRef.current[0]]);

  if (!turn) { return <></>; }

  // @ts-ignore .palette does exist on the theme object, though
  const bgColor = theme.palette.background.default;
  const gameMap: { [teamId: string]: number } =
    turn.schedule.reduce((memo, play, idx) => ({ ...memo, [play.homeTeam]: idx }), {});
  const sorter = playComparator(turn, standingsMap);
  const sortedPlays = Object.keys(gameMap || {})
    .map((teamId) => turn.schedule[gameMap[teamId]])
    .sort(sorter);

  const leftSubLeagueId = league(season).subleagues[0];
  const rightSubLeagueId = league(season).subleagues[1];
  const leftGames = sortedPlays.filter((play) =>
    teamSubleagueId(play.homeTeam, season) === leftSubLeagueId);
  const rightGames = sortedPlays.filter((play) =>
    teamSubleagueId(play.homeTeam, season) === rightSubLeagueId);

  return (
    <>
      <Hidden xsDown>
        <Grid container justify="center" className={styles.header}>
          <Hidden smDown>
            <Grid item container md={3} direction="column">
              <Grid item container className={styles.leftspace}>
                <div className={styles.leftmask} style={{ backgroundColor: bgColor }}></div>
              </Grid>
              <Grid item className={styles.leftshoulder}>&nbsp;</Grid>
            </Grid>
          </Hidden>
          <Grid item container sm={6} md={3} alignContent="center" justify="flex-end" className={styles.left}>
            {subleagues[leftSubLeagueId].shortName}
          </Grid>
          <Grid item container sm={6} md={3} alignContent="center" justify="flex-start" className={styles.right}>
            {subleagues[rightSubLeagueId].shortName}
          </Grid>
          <Hidden smDown>
            <Grid item container md={3} direction="column">
              <Grid item container className={styles.rightspace}>
                <div className={styles.rightmask} style={{ backgroundColor: bgColor }}></div>
              </Grid>
              <Grid item className={styles.rightshoulder}>&nbsp;</Grid>
            </Grid>
          </Hidden>
        </Grid>
      </Hidden>
      <Grid container className={styles.scoreboard}>
        <Grid container item xs={12} sm={6} direction="column" className={styles.leftgames}>
          {leftGames.map((play) => (
            <Grid item container key={play.homeTeam}>
              <Game play={play} standings={standingsMap} />
            </Grid>
          ))}
        </Grid>
        <Grid container item xs={12} sm={6} direction="column" className={styles.rightgames}>
          {rightGames.map((play) => (
            <Grid item container key={play.homeTeam}>
              <Game play={play} standings={standingsMap} />
            </Grid>
          ))}
        </Grid>
        <Grid item container xs={12} alignContent="center" justify="center" className={styles.footnote}>
          {turn.schedule.some((play) => isAbomination(play))
            ? <span>* abomination</span>
            : <span>&nbsp;</span>}
        </Grid>
      </Grid>
    </>
  );
}

export default ScoreBoard;
