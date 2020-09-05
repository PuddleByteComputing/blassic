import React, { useContext } from 'react';
import { IconButton } from '@material-ui/core';
import { FastRewind } from '@material-ui/icons';
import { clockContext } from '../ClockProvider';

function RewindButton() {
  const { playing, turnNumber, setTurnNumber } = useContext(clockContext);

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
