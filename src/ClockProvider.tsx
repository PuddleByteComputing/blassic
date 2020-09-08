import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

import { gameDataContext } from './GameDataProvider';

interface ClockApiType {
  dawdle: (val: number) => void,
  dawdling: number,
  playing: boolean,
  playBall: (val: boolean) => void,
  turnNumber: number,
  setTurnNumber: (val: number) => void,
}

const initialState: ClockApiType = {
  dawdle: (_val) => null,
  dawdling: 1000,
  playing: false,
  playBall: (_val) => null,
  turnNumber: 0,
  setTurnNumber: (_val) => null,
};

export const clockContext = createContext(initialState);
const { Provider } = clockContext;

function ClockProvider({ children }: { children: React.ReactNode }) {
  const { streaming, turnsRef } = useContext(gameDataContext);

  const ticking: React.MutableRefObject<ReturnType<typeof setTimeout> | null> = useRef(null);
  const [turnNumber, setTurnNumber] = useState(0);
  const [playing, playBall] = useState(false);
  const [dawdling, dawdle] = useState(500); // ms between pitches

  const stopTicking: () => ReturnType<typeof setTimeout> | null = () => {
    if (ticking.current) {
      const wasTicking = ticking.current;
      clearTimeout(ticking.current);
      ticking.current = null;
      return wasTicking;
    }
    return null;
  };

  const advanceClock = () => {
    if (turnNumber + 1 >= turnsRef.current.length) {
      if (streaming) {
        // game data is still loading, wait for moar buffar
        ticking.current = setTimeout(advanceClock, 10);
      } else {
        // reached end of game
        stopTicking();
        playBall(false);
      }
    } else {
      setTurnNumber(turnNumber + 1); // triggers tick() via useEffect()
    }
  };

  const tick = () => {
    if (playing) {
      ticking.current = setTimeout(advanceClock, dawdling);
    } else if (ticking.current !== null) { // !playing
      // cancel any outstanding tick when playing is set to false
      stopTicking();
    }
  };

  useEffect(tick, [playing, turnNumber]);

  function externalSetTurnNumber(val: number) {
    stopTicking();
    setTurnNumber(val);
  }

  function externalDawdle(val: number) {
    const wasTicking = stopTicking();
    dawdle(val);
    if (wasTicking) { tick(); }
  }

  const api = {
    dawdle: externalDawdle,
    dawdling: dawdling,
    playing,
    playBall,
    turnNumber,
    setTurnNumber: externalSetTurnNumber
  };

  return (<Provider value={api}>{children}</Provider>);
}

export default ClockProvider;
