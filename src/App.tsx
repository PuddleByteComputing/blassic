import React, { useEffect, useRef, useState, MutableRefObject } from 'react';
import { Container, Grid } from '@material-ui/core';

import createReadableStreamLineReader from './lib/readable-stream-line-reader';
import ScoreBoard from './scoreboard/ScoreBoard';
import PlaybackControls from './PlaybackControls';
import { GameDataType, GameTurnType } from './lib/blaseball-api-types';

import styles from './App.module.scss';

interface GameStore {
  data: {
    [season: string]: {
      [day: string]: GameDataType[]
    },
  },
}

async function openStream(season: string, day: string) {
  return fetch(`/forbidden-knowledge/digested/${season}/${day}.txt`)
    .then(response => response.body)
    .then(body => createReadableStreamLineReader(body))
    .then((lineStream) => lineStream.getReader())
    .catch(error => console.error(error));
}

const initialGameState = { data: {} } as GameStore;

function App() {
  const season = '2' as string;
  const day = '53' as string;

  const [gameCache, updateGames] = useState(initialGameState);
  //const turns: GameDataType[] = useRef([]);
  const turns: MutableRefObject<GameDataType[]> = useRef([]);
  const streaming = useRef('');
  const [turnNumber, setTurnNumber] = useState(0);
  const [playing, playBall] = useState(false);

  const [dawdling, dawdle] = useState(500); // min ms between pitches
  const [fussing, fuss] = useState(0.1); // additional time between pitches (fraction of dawdle)

  const turn = turns.current[turnNumber];

  const clock = () => {
    if (playing) {
      if (turnNumber < turns.current.length - 1) {
        setTimeout(() => setTurnNumber(turnNumber + 1), dawdling * (1 + fussing * Math.random()));
      } else if (streaming.current) {
        setTimeout(() => playBall(playing), 20); // using playBall() to trigger re-render
      }
    }
  };

  useEffect(clock, [playing, turnNumber, dawdling, fussing]);

  const retrieveData = () => {
    if (!turns.current.length) {
      if (gameCache.data?.[season]?.[day]) {
        turns.current = [...gameCache.data[season][day]];
      } else if (!streaming.current && season && day) {
        fetchDay(season, day);
      }
    }
  };

  useEffect(retrieveData, [season, day]);

  const cacheGame = () => {
    updateGames({
      data: {
        ...gameCache.data,
        [season]: {
          ...gameCache.data?.[season],
          [day]: [...turns.current],
        },
      },
    });
  };

  const receiveTurn = (newTurn: GameDataType) => {
    if (!turns.current.length) {
      setTurnNumber(0); // triggers re-render
    }
    turns.current.push(newTurn);
  };

  const fetchDay = (season: string, day: string) => {
    streaming.current = `s${season}d${day}`;
    openStream(season, day)
      .then((lineReader) => {
        if (!lineReader) { return; }

        lineReader.read().then(function processLine(result) {
          if (result.done) {
            cacheGame();
            streaming.current = '';
            return;
          }
          receiveTurn(JSON.parse(result.value));
          lineReader.read().then(processLine);
        });
      });
  };

  return (
    <div className={styles.gridwrap}>
      <Grid container className={styles.header}>
        <Grid item md={3} />
        <Grid item xs={12} md={6} className={styles.title} justify="center">
          Blaseball <span className={styles.classic}>Classic</span>
          <div className={styles.subtitle}>
            Replay your favorite Blaseball games
          </div>
          <Grid item md={3} />
        </Grid>
      </Grid>
      <PlaybackControls
        dawdle={dawdle}
        dawdling={dawdling}
        fuss={fuss}
        fussing={fussing}
        playing={playing}
        playBall={playBall}
        turn={turn}
        turnNumber={turnNumber}
      />
      <ScoreBoard turn={turn} />
    </div>
  );
}

export default App;
