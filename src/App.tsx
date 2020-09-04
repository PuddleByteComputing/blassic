import React, { useEffect, useRef, useState, MutableRefObject } from 'react';
import { Grid } from '@material-ui/core';

import createReadableStreamLineReader from './lib/readable-stream-line-reader';
import ScoreBoard from './scoreboard';
import Splash from './Splash';
import Controls from './controls/';
import { GameDataType, GameMetaDataType, GameStoreType } from './types';

import styles from './App.module.scss';

async function openStream(season: string, day: string) {
  return fetch(`/forbidden-knowledge/${season}/${day}.txt`)
    .then(response => response.body)
    .then(body => createReadableStreamLineReader(body))
    .then((lineStream) => lineStream.getReader())
    .catch(error => console.error(error));
}

const initialGameState: GameStoreType = { data: {} };
const initialGameIndex: GameMetaDataType = {};

function App() {
  const [day, setDay] = useState('');
  const [season, setSeason] = useState('');
  const [gameIndex, setGameIndex] = useState(initialGameIndex);
  const [gameCache, updateGames] = useState(initialGameState);
  const turns: MutableRefObject<GameDataType[]> = useRef([]);
  const streaming = useRef('');
  const [turnNumber, setTurnNumber] = useState(0);
  const [playing, playBall] = useState(false);
  const dawdling = useRef(1000); // ms between pitches
  const dawdle = (val: number) => dawdling.current = val;

  const turn = turns.current[turnNumber];

  const clock = () => {
    if (playing) {
      if (turnNumber < turns.current.length - 1) {
        setTimeout(() => setTurnNumber(turnNumber + 1), dawdling.current);
      } else if (streaming.current) {
        setTimeout(() => playBall(playing), 20); // using playBall() to trigger re-render
      }
    }
  };

  useEffect(clock, [playing, turnNumber]);

  const fetchGameIndex = () => {
    fetch('/forbidden-knowledge/index.json')
      .then(response => response.json())
      .then(json => setGameIndex(json))
      .catch((err) => alert(`Could not fetch game archive index: ${err}`));
  };

  useEffect(fetchGameIndex, []);

  const retrieveData = () => {
    if (!(season && day)) { return; }

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
    // TODO: don't squash in-progress stream, if any
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
      <Grid container className={styles.controls}>
        <Controls
          dawdle={dawdle}
          dawdling={dawdling.current}
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
      </Grid >
      {!(season && day) ? <Splash /> : null}
      <ScoreBoard streaming={streaming.current} turn={turn} />
    </div>
  );
}

export default App;
