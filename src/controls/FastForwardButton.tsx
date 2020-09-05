import React, { useContext } from 'react';
import { IconButton } from '@material-ui/core';
import { FastForward } from '@material-ui/icons';
import { clockContext } from '../ClockProvider';
import { gameDataContext } from '../GameDataProvider';

function FastForwardButton() {
  const { turnCount } = useContext(gameDataContext);
  const { playing, setTurnNumber, turnNumber } = useContext(clockContext);

  const fastForward = () => {
    if (playing) {
      setTurnNumber(Math.min(turnCount - 1, turnNumber + 10));
    } else {
      setTurnNumber(Math.min(turnCount - 1, turnNumber + 1));
    }
  };

  return (
    <IconButton
      disabled={turnNumber + 1 >= turnCount}
      onClick={(event) => { event.stopPropagation(); fastForward(); }}
      onFocus={(event) => event.stopPropagation()}
      size="small"
    >
      <FastForward fontSize="small" />
    </IconButton >
  );
}

export default FastForwardButton;
