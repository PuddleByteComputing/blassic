import React from 'react';
import { Grid, Hidden } from '@material-ui/core';
import { useTheme } from '@material-ui/styles';
import Game from './game';
import { GameDataType, GameTurnType } from '../types';
import { teamIsGood, teamIsEvil } from '../lib/leagues';
import styles from './index.module.scss';

interface Props {
  streaming: string,
  turn: GameDataType
}

function ScoreBoard({ streaming, turn }: Props) {
  const theme = useTheme();
  const bgColor = theme.palette.background.default;

  const schedule = turn?.schedule;
  const gameMap: { [teamId: string]: number } = schedule?.reduce((memo, play, idx) => ({ ...memo, [play.homeTeam]: idx }), {});
  const goodHomeTeams = Object.keys(gameMap || {})?.filter(teamIsGood);
  const evilHomeTeams = Object.keys(gameMap || {})?.filter(teamIsEvil);

  const isAbomination = (play: GameTurnType) => teamIsEvil(play.awayTeam) === teamIsGood(play.homeTeam);

  if (!schedule) {
    if (streaming) {
      return (
        <Grid item container alignContent="center" justify="center">
          Loading game {streaming}
        </Grid>
      );
    }
    return (
      <Grid item container alignContent="center" justify="center">
        Select a Season and Day of Blaseball to replay
      </Grid>
    );
  }

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
            GOOD
          </Grid>
          <Hidden mdDown>
            <Grid item container lg={2} className={styles.green} />
          </Hidden>
          <Grid item container sm={6} md={3} lg={2} alignContent="center" justify="flex-start" className={styles.evil}>
            EVIL
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
      <Grid container justify="center" className={styles.scoreboard}>
        <Grid container item xs={12} sm={6} lg={5} direction="column">
          {goodHomeTeams.map((teamId) => (
            <Grid item container key={teamId}>
              <Game
                abominable={isAbomination(turn.schedule[gameMap[teamId]])}
                play={turn?.schedule?.[gameMap[teamId]]}
              />
            </Grid>
          ))}
        </Grid>
        <Hidden mdDown>
          <Grid item container lg={2} />
        </Hidden>
        <Grid container item xs={12} sm={6} lg={5} direction="column">
          {evilHomeTeams.map((teamId) => (
            <Grid item container key={teamId}>
              <Game
                abominable={isAbomination(turn.schedule[gameMap[teamId]])}
                play={turn?.schedule?.[gameMap[teamId]]}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  );
}

export default ScoreBoard;
