import React, { useContext } from 'react';
import { IconButton } from '@material-ui/core';
import { SkipNext } from '@material-ui/icons';

import { gameDataContext } from '../GameDataProvider';
import { clockContext } from '../ClockProvider';

function SkipForwardButton() {
  const { day, season, seasonSpans, setDay, streaming, turnsRef } = useContext(gameDataContext);
  const { turnNumber, setTurnNumber } = useContext(clockContext);
  const maxTurnIdx = turnsRef.current.length ? turnsRef.current.length - 1 : 0;

  const skipForward = () => {
    if (turnNumber < maxTurnIdx) {
      setTurnNumber(maxTurnIdx);
    } else if (day !== seasonSpans[season][1]?.toString()) {
      setTurnNumber(0);
      setDay(parseInt(day) + 1);
    }
  };

  return (
    <IconButton
      disabled={!!streaming || !day}
      onClick={(event) => { event.stopPropagation(); skipForward() }}
      onFocus={(event) => event.stopPropagation()}
      size="small"
    >
      <SkipNext fontSize="small" />
    </IconButton >
  );
}

export default SkipForwardButton;
