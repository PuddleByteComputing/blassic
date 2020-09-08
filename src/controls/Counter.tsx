import React, { useContext, useState } from 'react';
import { clockContext } from '../ClockProvider';
import { gameDataContext } from '../GameDataProvider';
import styles from './index.module.scss';

function formatTime(ms: number) {
  const minutes = Math.floor(ms / 1000 / 60);
  const seconds = Math.round(ms / 1000) % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function Counter() {
  const { turnNumber, dawdling } = useContext(clockContext);
  const { turnsRef } = useContext(gameDataContext);
  const [format, setFormat] = useState(1);

  if (!turnsRef.current.length) { return null; }

  const pseudoMsElapsed = turnNumber * dawdling;
  const pseudoMsTotal = (turnsRef.current.length - 1) * dawdling;
  const iffyness = dawdling > 250 ? '' : dawdling > 150 ? '?' : '??';

  const formatters = [
    () => `-${formatTime(pseudoMsTotal - pseudoMsElapsed)}${iffyness}`,
    () => `${turnNumber + 1}/${turnsRef.current.length}`,
    () => `${formatTime(pseudoMsElapsed)}${iffyness}`,
    () => `${formatTime(pseudoMsElapsed)}/${formatTime(pseudoMsTotal)}${iffyness}`,
  ];

  const handleClick = (_event: any) => setFormat(format === formatters.length - 1 ? 0 : format + 1);

  return (
    <span className={styles.counter} onClick={handleClick}>
      {formatters[format]()}
    </span>
  );
}

export default Counter;
