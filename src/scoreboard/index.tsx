import React, { useContext } from 'react';
import { Grid, Hidden } from '@material-ui/core';
import { useTheme } from '@material-ui/styles';
import { gameDataContext } from '../GameDataProvider';
import { clockContext } from '../ClockProvider';
import Game from './game';
import { league, subleagues, teamSubleagueId } from '../lib/leagues';
import { mapTeamsToStandings, playComparator } from '../lib/gamedata-utils';
import { isAbomination } from '../lib/play-utils';
import styles from './index.module.scss';

function ScoreBoard() {
  const { turnNumber } = useContext(clockContext);
  const { season, turnsRef } = useContext(gameDataContext);
  const theme = useTheme();
  const turn = turnsRef.current[turnNumber];
  if (!turn) { return <></>; }

  // @ts-ignore .palette does exist on the theme object, though
  const bgColor = theme.palette.background.default;
  const teamStandingsMap = mapTeamsToStandings(turn);
  const gameMap: { [teamId: string]: number } =
    turn.schedule.reduce((memo, play, idx) => ({ ...memo, [play.homeTeam]: idx }), {});
  const sorter = playComparator(turn);
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
              <Grid item container className={styles.goodspace}>
                <div className={styles.goodmask} style={{ backgroundColor: bgColor }}></div>
              </Grid>
              <Grid item className={styles.goodshoulder}>&nbsp;</Grid>
            </Grid>
          </Hidden>
          <Grid item container sm={6} md={3} lg={2} alignContent="center" justify="flex-end" className={styles.good}>
            {subleagues[leftSubLeagueId].shortName}
          </Grid>
          <Hidden mdDown>
            <Grid item container lg={2} className={styles.green} />
          </Hidden>
          <Grid item container sm={6} md={3} lg={2} alignContent="center" justify="flex-start" className={styles.evil}>
            {subleagues[rightSubLeagueId].shortName}
          </Grid>
          <Hidden smDown>
            <Grid item container md={3} direction="column">
              <Grid item container className={styles.evilspace}>
                <div className={styles.evilmask} style={{ backgroundColor: bgColor }}></div>
              </Grid>
              <Grid item className={styles.evilshoulder}>&nbsp;</Grid>
            </Grid>
          </Hidden>
        </Grid>
      </Hidden>
      <Grid container className={styles.scoreboard}>
        <Grid container item xs={12} sm={6} lg={5} direction="column">
          {leftGames.map((play) => (
            <Grid item container key={play.homeTeam}>
              <Game play={play}
                awayTeamStandings={teamStandingsMap[play.awayTeam]}
                homeTeamStandings={teamStandingsMap[play.homeTeam]} />
            </Grid>
          ))}
        </Grid>
        <Hidden mdDown>
          <Grid item container lg={2} />
        </Hidden>
        <Grid container item xs={12} sm={6} lg={5} direction="column">
          {rightGames.map((play) => (
            <Grid item container key={play.homeTeam}>
              <Game play={play}
                awayTeamStandings={teamStandingsMap[play.awayTeam]}
                homeTeamStandings={teamStandingsMap[play.homeTeam]} />
            </Grid>
          ))}
          {turn.schedule.some((play) => isAbomination(play)) ? (
            <Grid item container alignContent="center" justify="flex-end" className={styles.footnote}>
              * abomination
            </Grid>)
            : null}
        </Grid>
      </Grid>
    </>
  );
}

export default ScoreBoard;
