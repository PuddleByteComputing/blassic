import React, { useEffect, useRef, useState, MutableRefObject } from 'react';
import { Grid } from '@material-ui/core';

import createReadableStreamLineReader from './lib/readable-stream-line-reader';
import ScoreBoard from './scoreboard/ScoreBoard';
import PlaybackControls from './PlaybackControls';
import { GameDataType } from './lib/blaseball-api-types';

import styles from './App.module.scss';

interface GameStore {
  data: {
    [season: string]: {
      [day: string]: GameDataType[]
    },
  },
}

export interface GameMetaData {
  [season: string]: {
    [day: string]: {
      turns: number,
      completed: boolean,
      started: boolean,
    }
  }
}

async function openStream(season: string, day: string) {
  return fetch(`/forbidden-knowledge/${season}/${day}.txt`)
    .then(response => response.body)
    .then(body => createReadableStreamLineReader(body))
    .then((lineStream) => lineStream.getReader())
    .catch(error => console.error(error));
}

const initialGameState: GameStore = { data: {} };
const initialGameIndex: GameMetaData = {};

function App() {
  const [day, setDay] = useState('');
  const [season, setSeason] = useState('');
  const [gameIndex, setGameIndex] = useState(initialGameIndex);
  const [gameCache, updateGames] = useState(initialGameState);
  const turns: MutableRefObject<GameDataType[]> = useRef([]);
  const streaming = useRef('');
  const [turnNumber, setTurnNumber] = useState(0);
  const [playing, playBall] = useState(false);
  const [dawdling, dawdle] = useState(4000); // min ms between pitches

  const turn = turns.current[turnNumber];

  const clock = () => {
    if (playing) {
      if (turnNumber < turns.current.length - 1) {
        setTimeout(() => setTurnNumber(turnNumber + 1), dawdling);
      } else if (streaming.current) {
        setTimeout(() => playBall(playing), 20); // using playBall() to trigger re-render
      }
    }
  };

  useEffect(clock, [playing, turnNumber, dawdling]);

  const fetchGameIndex = () => {
    fetch('/forbidden-knowledge/index.json')
      .then(response => response.json())
      .then(json => setGameIndex(json))
      .catch((err) => alert(`Could not fetch game archive index: ${err}`));
  };

  useEffect(fetchGameIndex, []);

  const retrieveData = () => {
    if (!(season && day)) { return; }
    console.log(`retreiving s${season}d${day}`);

    if (gameCache.data?.[season]?.[day]) {
      turns.current = [...gameCache.data[season][day]];
    } else if (!streaming.current && season && day) {
      fetchDay(season, day);
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
    turns.current = [];
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

  const handleSetDay = (day: string) => {
    playBall(false);
    setTurnNumber(0);
    setDay(day);
  };

  const handleSetSeason = (season: string) => {
    setDay('');
    setSeason(season);
  };

  return (
    <div className={styles.gridwrap}>
      <Grid container className={styles.header}>
        <Grid item md={3} />
        <Grid item xs={12} md={6} className={styles.title}>
          Blaseball <span className={styles.classic}>Classic</span>
          <div className={styles.subtitle}>
            Relive your favorite Blaseball Games
          </div>
          <Grid item md={3} />
        </Grid>
      </Grid>
      <PlaybackControls
        dawdle={dawdle}
        dawdling={dawdling}
        day={day}
        gameIndex={gameIndex}
        playing={playing}
        playBall={playBall}
        turn={turn}
        turnNumber={turnNumber}
        season={season}
        setDay={handleSetDay}
        setSeason={handleSetSeason}
      />
      <ScoreBoard turn={turn} />
    </div>
  );
}

export default App;
