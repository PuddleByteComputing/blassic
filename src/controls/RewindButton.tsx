import React from 'react';
import { IconButton } from '@material-ui/core';
import { FastRewind } from '@material-ui/icons';

interface Props {
  playing: boolean,
  setTurnNumber: (val: number) => void,
  turnNumber: number,
}

function RewindButton({ playing, setTurnNumber, turnNumber }: Props) {
  const rewind = () => {
    if (playing) {
      setTurnNumber(Math.max(0, turnNumber - 10));
    } else {
      setTurnNumber(Math.max(0, turnNumber - 1));
    }
  };

  return (
    <IconButton
      disabled={turnNumber < 1}
      onClick={(event) => { event.stopPropagation(); rewind(); }}
      onFocus={(event) => event.stopPropagation()}
      size="small"
    >
      <FastRewind fontSize="small" />
    </IconButton >
  );
}

export default RewindButton;
