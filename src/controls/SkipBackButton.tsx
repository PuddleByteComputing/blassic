import React, { useContext } from 'react';
import { IconButton } from '@material-ui/core';
import { SkipPrevious } from '@material-ui/icons';
import { clockContext } from '../ClockProvider';
import { gameDataContext } from '../GameDataProvider';

function SkipBackButton() {
  const { turnNumber, setTurnNumber } = useContext(clockContext);
  const { day, streaming, setDay } = useContext(gameDataContext);

  const skipBack = () => {
    if (turnNumber === 0) {
      const previousDay = Math.max(0, parseInt(day || '0') - 1);
      setTurnNumber(0);
      setDay(previousDay);
    } else {
      setTurnNumber(0);
    }
  };

  return (
    <IconButton
      disabled={!!(streaming || !day || (day === '0' && turnNumber < 1))}
      onClick={(event) => { event.stopPropagation(); skipBack() }}
      onFocus={(event) => event.stopPropagation()}
      size="small"
    >
      <SkipPrevious fontSize="small" />
    </IconButton>
  );
}

export default SkipBackButton;
