import React, { useState, useContext } from 'react';
import { Grid, Slider } from '@material-ui/core';
import { clockContext } from '../ClockProvider';
import styles from './index.module.scss';

const dsteps = 100;
const dmax = 10000;
const dmin = 5;

const dawdleScale = (value: number) => dmin + (dmax - dmin) * value ** 2 / dsteps ** 2;

const formatDawdle = (dawdleFeedback: number) => {
  const dawdleSeconds = dawdleScale(dawdleFeedback) / 1000;

  return dawdleSeconds.toFixed(dawdleSeconds < 1 ? 2 : 1);
};

type HandlerType = (_event: any, value: number) => void;

function Speed() {
  const { dawdling, dawdle } = useContext(clockContext);

  const [dawdleFeedback, setDawdleFeedback] = useState(Math.sqrt(dawdling * dsteps ** 2 / dmax));

  const handleDawdleCommit: HandlerType = (_e, val: number) => dawdle(dawdleScale(val));
  const handleDawdleChange: HandlerType = (_e, val: number) => setDawdleFeedback(val);

  return (
    <>
      <Grid item container xs={3} sm={4} md={4} alignContent="center" justify="flex-end">
        Dawdle:
      </Grid>
      <Grid item container xs={6} sm={4} md={5} alignContent="center" justify="center" className={styles.slider}>
        {/* @ts-ignore -- Slider callbacks are typed number | number[]; we're not using range sliders */}
        <Slider
          value={dawdleFeedback}
          min={0}
          max={dsteps}
          onChange={handleDawdleChange}
          onChangeCommitted={handleDawdleCommit}
        />
      </Grid>
      <Grid item container xs={3} sm={4} md={2} alignContent="center" justify="flex-start" className={styles.dawdle}>
        {formatDawdle(dawdleFeedback)}s
      </Grid>
    </>
  );
}

export default Speed;
