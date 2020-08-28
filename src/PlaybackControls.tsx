import React, { ChangeEvent, useState } from 'react';
import { Grid, IconButton, Paper, Slider } from '@material-ui/core';
import { PlayCircleFilled, PauseCircleFilled } from '@material-ui/icons';
import { GameDataType } from './lib/blaseball-api-types';
import styles from './PlaybackControls.module.scss';

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
  dawdle: (val: number) => void,
  dawdling: number,
  fuss: (val: number) => void,
  fussing: number,
  playing: boolean,
  playBall: (val: boolean) => void,
  turn: GameDataType,
  turnNumber: number
}

function PlaybackControls({ dawdle, dawdling, fuss, fussing, playing, playBall, turn, turnNumber }: Props) {
  const dsteps = 100;
  const dmax = 30000;
  const [dawdleFeedback, setDawdleFeedback] = useState(Math.sqrt(dawdling * dsteps ** 2 / dmax));
  const [fussFeedback, setFussFeedback] = useState(fussing * 100);

  const handleDawdleCommit: HandlerType = (_event, value: number) =>
    dawdle(dawdleScale(value));
  const handleDawdleChange: HandlerType = (_event, value: number) =>
    setDawdleFeedback(value);
  const handleFussCommit: HandlerType = (_event, value: number) =>
    fuss(value / 100);
  const handleFussChange: HandlerType = (_event, value: number) =>
    setFussFeedback(value);

  const dawdleScale = (value: number) => Math.max(1, Math.floor(dmax * value ** 2 / dsteps ** 2));

  return (
    <Paper className={styles.paper}>
      <Grid container>
        <Grid item container alignContent="center" justify="flex-start" xs={5}>
          Season {turn?.season?.seasonNumber || '???'},
          day {turn?.schedule?.[0]?.day || '???'},
          turn {turnNumber}
        </Grid>
        <Grid item container alignContent="center" justify="center" xs={2}>
          <PauseButton playing={playing} playBall={playBall} />
        </Grid>
        <Grid item container alignContent="center" justify="flex-end" direction="column" xs={5}>
          <Grid item container alignContent="center" spacing={1}>
            <Grid item container xs={4} justify="flex-end">
              Dawdle:
            </Grid>
            <Grid item container xs={6} justify="center">
              {/* @ts-ignore -- Slider callbacks are typed number | number[]; we're not using range sliders */}
              <Slider
                value={dawdleFeedback}
                min={2}
                max={dsteps}
                onChange={handleDawdleChange}
                onChangeCommitted={handleDawdleCommit}
              />
            </Grid>
            <Grid item container xs={2} justify="flex-end">
              {(dawdleScale(dawdleFeedback) / 1000).toFixed(dawdleFeedback >= dsteps / 4 ? 0 : 2)}s
            </Grid>
          </Grid>
          <Grid item container alignContent="center" spacing={1}>
            <Grid item container xs={4} justify="flex-end">
              Fuss:
            </Grid>
            <Grid item container xs={6} justify="center">
              {/* @ts-ignore -- Slider callbacks are typed number | number[]; we're not using range sliders */}
              <Slider
                value={fussFeedback}
                min={0}
                max={200}
                onChange={handleFussChange}
                onChangeCommitted={handleFussCommit}
              />
            </Grid>
            <Grid item container xs={2} justify="flex-end">
              {Math.floor(fussFeedback)}%
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper >
  );
}

export default PlaybackControls;
