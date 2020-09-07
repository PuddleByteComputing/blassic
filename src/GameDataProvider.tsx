import React, { createContext, useEffect, useRef, useState } from 'react';
import { GameDataType, GameMetaDataType, GameCacheType } from './types';
import createReadableStreamLineReader from './lib/readable-stream-line-reader';

interface GameDataProviderApi {
  available: GameMetaDataType,
  day: string,
  season: string,
  seasonSpans: { [season: string]: number[] }
  setDay: (day: string | number) => void,
  setSeason: (season: string) => void,
  streaming: string,
  turnsRef: React.MutableRefObject<GameDataType[]>,
}

const initialGameCache: GameCacheType = { data: {} };
const initialAvailableGames: GameMetaDataType = {};

const initialState: GameDataProviderApi = {
  available: initialAvailableGames,
  day: '',
  season: '',
  seasonSpans: {},
  setDay: (_day: string | number) => null,
  setSeason: (_season: string) => null,
  streaming: '',
  // @ts-ignore -- Can't createContext() inside the component, can't useRef() outside
  turnsRef: undefined,
};

export const gameDataContext = createContext(initialState);
const { Provider } = gameDataContext;

async function openStream(season: string, day: string) {
  return fetch(`/forbidden-knowledge/${season}/${day}.txt`)
    .then(response => response.body)
    .then(body => body && createReadableStreamLineReader(body))
    .then((lineStream) => lineStream?.getReader())
    .catch(error => console.error(error));
}

interface Props { children: React.ReactNode }

function GameDataProvider({ children }: Props) {
  const [day, setDay] = useState('');
  const [season, setSeason] = useState('');
  const [seasonSpans, setSeasonSpans] = useState({} as { [seasonId: string]: number[] });
  const turns: React.MutableRefObject<GameDataType[]> = useRef([]);
  const [streaming, setStreaming] = useState('');

  const [available, setAvailableGames] = useState(initialAvailableGames);
  const [cache, updateCache] = useState(initialGameCache);
  const cacheGame = () => {
    if (!cache.data[season]) {
      cache.data[season] = { [day]: [...turns.current] };
    } else {
      cache.data[season][day] = [...turns.current];
    }
    updateCache(cache);
  };

  const seasonSpan = (season: string, available: GameMetaDataType) => {
    const sortedDays = Object.keys(available[season])
      .map((day) => parseInt(day))
      .sort((a, b) => a === b ? 0 : (a < b ? -1 : 1));
    const lastIdx = sortedDays.length - 1;
    return [sortedDays[0], sortedDays[lastIdx]].map((day) => day.toString());
  };

  const ingestAvailableGames = (available: GameMetaDataType) => {
    const availableSeasonSpans = Object.keys(available)
      .reduce((memo, season) => ({ ...memo, [season]: seasonSpan(season, available) }), {});

    setSeasonSpans(availableSeasonSpans);
    setAvailableGames(available);
  };

  const fetchAvailableGames = () => {
    fetch('/forbidden-knowledge/index.json')
      .then(response => response.json())
      .then(available => ingestAvailableGames(available))
      .catch((err) => console.error(`Could not fetch available games index: ${err}`));
  };

  const fetchGame = (season: string, day: string) => {
    // TODO: don't squash in-progress stream with new stream
    setStreaming(`s${season}d${day}`);
    turns.current = [];
    openStream(season, day)
      .then((lineReader) => {
        if (!lineReader) { return; }

        lineReader.read().then(function processLine(result) {
          if (result.done) {
            setStreaming('');
            cacheGame();
            return;
          }

          turns.current.push(JSON.parse(result.value));

          lineReader.read().then(processLine);
        });
      });
  };

  const setGame = () => {
    if (!(season && day)) { return; }

    if (cache.data?.[season]?.[day]) {
      turns.current = [...cache.data[season][day]];
    } else if (!streaming && season && day) {
      fetchGame(season, day);
    }
  };

  useEffect(fetchAvailableGames, []); // retrieve available games index on mount
  useEffect(setGame, [season, day]); // get game data from cache or network when season/day change

  const externalSetDay = (val: string | number) => setDay(val.toString());
  const externalSetSeason = (season: string) => {
    setDay('');
    setSeason(season);
  };


  const api = {
    available,
    day,
    season,
    seasonSpans,
    setDay: externalSetDay,
    setSeason: externalSetSeason,
    streaming: streaming,
    turnsRef: turns
  };

  return <Provider value={api}>{children}</Provider>;
}

export default GameDataProvider;
