import React, { ChangeEvent, useState } from 'react';
import { FormControl, Grid, IconButton, MenuItem, Select, Slider } from '@material-ui/core';
import { PlayCircleFilled, PauseCircleFilled } from '@material-ui/icons';
import { GameDataType, GameMetaDataType } from '../types';
import styles from './index.module.scss';

interface PauseProps {
  playing: boolean,
  playBall: (val: boolean) => void,
}

function PauseButton({ playing, playBall }: PauseProps) {
  if (playing) {
    return (
      <IconButton
        className={styles.pause}
        onClick={(event) => { event.stopPropagation(); playBall(false); }}
        onFocus={(event) => event.stopPropagation()}
      >
        <PauseCircleFilled />
      </IconButton>
    );
  } else {
    return (
      <IconButton
        className={styles.pause}
        onClick={(event) => { event.stopPropagation(); playBall(true); }}
        onFocus={(event) => event.stopPropagation()}
      >
        <PlayCircleFilled />
      </IconButton>
    );
  }
}

type HandlerType = (_event: ChangeEvent<{}>, value: number) => void;

interface Props {
  day: string,
  dawdle: (val: number) => void,
  dawdling: number,
  gameIndex: GameMetaDataType,
  playing: boolean,
  playBall: (val: boolean) => void,
  setDay: (val: string) => void,
  setSeason: (val: string) => void,
  turn: GameDataType,
  turnNumber: number,
  season: string,
}

const dsteps = 100;
const dmax = 5000;
const dmin = 5;

const dawdleScale = (value: number) => dmin + (dmax - dmin) * value ** 2 / dsteps ** 2;

const formatDawdle = (dawdleFeedback: number) => {
  const dawdleSeconds = dawdleScale(dawdleFeedback) / 1000;

  return dawdleSeconds.toFixed(dawdleSeconds < 1 ? 2 : 1);
};

function Controls({ dawdle, dawdling, gameIndex, playing, playBall, turn, turnNumber, day, season, setSeason, setDay }: Props) {
  const [dawdleFeedback, setDawdleFeedback] = useState(Math.sqrt(dawdling * dsteps ** 2 / dmax));

  const handleDawdleCommit: HandlerType = (_event, value: number) =>
    dawdle(dawdleScale(value));
  const handleDawdleChange: HandlerType = (_event, value: number) =>
    setDawdleFeedback(value);

  const handleSetSeason = (e: any): void => setSeason(e.target.value);
  const handleSetDay = (e: any): void => setDay(e.target.value);


  return (
    <Grid container className={styles.controls}>
      <Grid item container alignContent="center" justify="flex-start" xs={8} md={5}>
        <Grid item xs={4}>
          <FormControl>
            <Select
              className={styles.gamepicker}
              displayEmpty
              onChange={handleSetSeason}
              value={season}
            >
              <MenuItem value="" key="seasonPlaceholder" className={styles.gamemenuitem}>
                Select Season
              </MenuItem>
              {Object.keys(gameIndex).map((availableSeason) =>
                <MenuItem
                  className={styles.gamemenuitem}
                  key={availableSeason}
                  value={availableSeason}
                >
                  Season {parseInt(availableSeason) + 1}
                </MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl>
            <Select
              className={styles.gamepicker}
              disabled={!season}
              displayEmpty
              onChange={handleSetDay}
              value={day}
            >
              <MenuItem value="" key="dayPlaceholder" className={styles.gamemenuitem}>
                Select Day
              </MenuItem>
              {season && Object.keys(gameIndex[season]).map((availableDay) =>
                <MenuItem
                  className={styles.gamemenuitem}
                  key={availableDay}
                  value={availableDay}
                >
                  Day {parseInt(availableDay) + 1}
                </MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
        </Grid>
      </Grid>
      <Grid item container xs={4} md={2} alignContent="center" justify="center">
        <PauseButton playing={playing} playBall={playBall} />
      </Grid>
      <Grid item container xs={12} md={5} alignContent="center" justify="center">
        <Grid item container xs={2} md={4} alignContent="center" justify="flex-end">
          Dawdle:
        </Grid>
        <Grid item container xs={8} md={6} alignContent="center" justify="center" className={styles.slider}>
          {/* @ts-ignore -- Slider callbacks are typed number | number[]; we're not using range sliders */}
          <Slider
            value={dawdleFeedback}
            min={0}
            max={dsteps}
            onChange={handleDawdleChange}
            onChangeCommitted={handleDawdleCommit}
          />
        </Grid>
        <Grid item container xs={2} md={2} alignContent="center" justify="flex-start">
          {formatDawdle(dawdleFeedback)}s
        </Grid>
      </Grid>
    </Grid >
  );
}

export default Controls;
