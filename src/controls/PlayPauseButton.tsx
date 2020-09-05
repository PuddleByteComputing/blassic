import React, { useContext } from 'react';
import { IconButton } from '@material-ui/core';
import { PlayCircleFilled, PauseCircleFilled, Replay } from '@material-ui/icons';
import { clockContext } from '../ClockProvider';
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

interface Props {
  turnCount: number,
}

function PlayPauseButton({ turnCount }: Props) {
  const { playing, playBall, turnNumber, setTurnNumber } = useContext(clockContext);

  if (playing) {
    return (<PauseButton pause={() => playBall(false)} />);
  } else if (turnCount && (turnNumber >= turnCount - 1)) {
    return (<ReplayButton replay={() => { setTurnNumber(0); playBall(true); }} />);
  }

  return (<PlayButton play={() => playBall(true)} disabled={!turnCount} />);
}

export default PlayPauseButton;
