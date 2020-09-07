import React, { useContext } from 'react';
import { IconButton } from '@material-ui/core';
import { PlayCircleFilled, PauseCircleFilled, Replay } from '@material-ui/icons';
import { clockContext } from '../ClockProvider';
import { gameDataContext } from '../GameDataProvider';
import styles from './index.module.scss';

const PauseButton = ({ pause }: { pause: () => void }) => (
  <IconButton
    className={styles.pause}
    onClick={(event) => { event.stopPropagation(); pause(); }}
    onFocus={(event) => event.stopPropagation()}
  >
    <PauseCircleFilled fontSize="large" />
  </IconButton>
);

const PlayButton = ({ disabled, play }: { disabled: boolean, play: () => void }) => (
  <IconButton
    className={styles.pause}
    disabled={disabled}
    onClick={(event) => { event.stopPropagation(); play(); }}
    onFocus={(event) => event.stopPropagation()}
  >
    <PlayCircleFilled fontSize="large" />
  </IconButton>
);

const ReplayButton = ({ replay }: { replay: () => void }) => (
  <IconButton
    className={styles.pause}
    onClick={(event) => { event.stopPropagation(); replay(); }}
    onFocus={(event) => event.stopPropagation()}
  >
    <Replay fontSize="large" />
  </IconButton>
);

function PlayPauseButton() {
  const { playing, playBall, turnNumber, setTurnNumber } = useContext(clockContext);
  const { turnsRef } = useContext(gameDataContext);
  const turnsLength = turnsRef.current.length;

  if (playing) {
    return (<PauseButton pause={() => playBall(false)} />);
  } else if (turnsLength && (turnNumber >= turnsLength - 1)) {
    return (<ReplayButton replay={() => { setTurnNumber(0); playBall(true); }} />);
  }

  return (<PlayButton play={() => playBall(true)} disabled={!turnsLength} />);
}

export default PlayPauseButton;
