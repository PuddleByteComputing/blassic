import React, { createContext, useEffect, useRef, useState } from 'react';
import { GameDataType, GameMetaDataType, GameCacheType } from './types';
import createReadableStreamLineReader from './lib/readable-stream-line-reader';

const initialGameCache: GameCacheType = { data: {} };
const initialAvailableGames: GameMetaDataType = {};
interface GameDataProviderApi {
  available: GameMetaDataType,
  cache: GameCacheType,
  day: string,
  season: string,
  setDay: (day: string) => void,
  setSeason: (season: string) => void,
  streaming: string,
  turnCount: number,
  turns: GameDataType[],
}

const initialState: GameDataProviderApi = {
  available: {},
  cache: { data: {} },
  day: '',
  season: '',
  setDay: (_day: string) => null,
  setSeason: (_season: string) => null,
  streaming: '',
  turnCount: 0,
  turns: [],
};

export const gameDataContext = createContext(initialState);
const { Provider } = gameDataContext;

async function openStream(season: string, day: string) {
  return fetch(`/forbidden-knowledge/${season}/${day}.txt`)
    .then(response => response.body)
    .then(body => createReadableStreamLineReader(body))
    .then((lineStream) => lineStream.getReader())
    .catch(error => console.error(error));
}

interface Props { children: React.ReactNode }

function GameDataProvider({ children }: Props) {
  const [day, setDay] = useState('');
  const [season, setOnlySeason] = useState('');
  const setSeason = (season: string) => {
    setDay('');
    setOnlySeason(season);
  };

  const [turnCount, updateTurnCount] = useState(0);
  const turns: React.MutableRefObject<GameDataType[]> = useRef([]);
  const streaming = useRef('');

  const [available, setAvailableGames] = useState(initialAvailableGames);
  const [cache, updateCache] = useState(initialGameCache);
  const cacheGame = () => {
    if (!cache.data[season]) {
      cache.data[season] = { [day]: [...turns.current] };
    } else {
      cache.data[season][day] = [...turns.current];
    }
    updateCache(cache);
    updateTurnCount(turns.current.length);
  };

  const fetchAvailableGames = () => {
    fetch('/forbidden-knowledge/index.json')
      .then(response => response.json())
      .then(json => setAvailableGames(json))
      .catch((err) => alert(`Could not fetch available games index: ${err}`));
  };

  const fetchGame = (season: string, day: string) => {
    // TODO: don't squash in-progress stream, if any
    streaming.current = `s${season}d${day}`;
    turns.current = [];
    openStream(season, day)
      .then((lineReader) => {
        if (!lineReader) { return; }

        lineReader.read().then(function processLine(result) {
          if (result.done) {
            streaming.current = ''; // set ref value *before* triggering re-render via cacheGame()
            cacheGame();
            return;
          }

          turns.current.push(JSON.parse(result.value));
          // re-render only on first and then every 10th received line
          if (turns.current.length % 10 === 1) {
            updateTurnCount(turns.current.length);
          }

          lineReader.read().then(processLine);
        });
      });
  };

  const setGame = () => {
    if (!(season && day)) { return; }

    if (cache.data?.[season]?.[day]) {
      turns.current = [...cache.data[season][day]];
      updateTurnCount(turns.current.length);
    } else if (!streaming.current && season && day) {
      fetchGame(season, day);
    }
  };

  useEffect(fetchAvailableGames, []); // retrieve available games index on mount
  useEffect(setGame, [season, day]); // get game data from cache or network when season/day change

  const exposed = { available, cache, day, season, setDay, setSeason, streaming: streaming.current, turnCount, turns: turns.current };
  return <Provider value={exposed}>{children}</Provider>;
}

export default GameDataProvider;
