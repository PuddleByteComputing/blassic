import React, { useContext } from 'react';
import { IconButton } from '@material-ui/core';
import { FastForward } from '@material-ui/icons';
import { clockContext } from '../ClockProvider';
import { gameDataContext } from '../GameDataProvider';

function FastForwardButton() {
  const { turnsRef } = useContext(gameDataContext);
  const { playing, setTurnNumber, turnNumber } = useContext(clockContext);
  const maxTurnIdx = turnsRef.current.length ? turnsRef.current.length - 1 : 0;

  const fastForward = () => {
    if (playing) {
      setTurnNumber(Math.min(maxTurnIdx, turnNumber + 10));
    } else {
      setTurnNumber(Math.min(maxTurnIdx, turnNumber + 1));
    }
  };

  return (
    <IconButton
      disabled={turnNumber >= maxTurnIdx}
      onClick={(event) => { event.stopPropagation(); fastForward(); }}
      onFocus={(event) => event.stopPropagation()}
      size="small"
    >
      <FastForward fontSize="small" />
    </IconButton >
  );
}

export default FastForwardButton;
