import React, { useEffect, useRef, useState } from 'react';
import { Container, Paper } from '@material-ui/core';

import createReadableStreamLineReader from './lib/readable-stream-line-reader';
import ScoreBoard from './scoreboard/ScoreBoard';
import PlaybackControls from './PlaybackControls';

import styles from './App.module.scss';

interface GameStore {
  data: {
    [season: string]: {
      [day: string]: any[]
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
  const turns = useRef([]);
  const streaming = useRef('');
  const [turnNumber, setTurnNumber] = useState(0);
  const [playing, playBall] = useState(false);

  const [dawdling, dawdle] = useState(500);
  const [fussing, fuss] = useState(0);

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

  const receiveTurn = (newTurn) => {
    if (!turns.length) {
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
    <Container className={styles.container}>
      <Paper square className={styles.paper} variant="outlined">
        <div className={styles.title}>
          Blaseball <span className={styles.classic}>Classic</span>
        </div>
        <div className={styles.subtitle}>
          Replay your favorite Blaseball games
        </div>
      </Paper>
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
    </Container>
  );
}

export default App;
