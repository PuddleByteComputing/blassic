import React from 'react';
import { IconButton } from '@material-ui/core';
import { PlayCircleFilled, PauseCircleFilled, Replay } from '@material-ui/icons';

import { GameDataType } from '../types';
import styles from './index.module.scss';

const PauseButton = ({ pause }: { pause: () => void }) => (
  <IconButton
    className={styles.pause}
    onClick={(event) => { event.stopPropagation(); pause(); }}
    onFocus={(event) => event.stopPropagation()}
  >
    <PauseCircleFilled />
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
    <Replay />
  </IconButton>
);

interface Props {
  playing: boolean,
  playBall: (val: boolean) => void,
  turnNumber: number,
  turns: GameDataType[],
  setTurnNumber: (val: number) => void,
}

function PlayPauseButton({ playing, playBall, turnNumber, setTurnNumber, turns }: Props) {
  if (playing) {
    return (<PauseButton pause={() => playBall(false)} />);
  } else if (turns?.length && turnNumber >= turns.length - 1) {
    return (<ReplayButton replay={() => { setTurnNumber(0); playBall(true); }} />);
  }

  return (<PlayButton play={() => playBall(true)} disabled={!turns?.length} />);
}

export default PlayPauseButton;
