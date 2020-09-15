import React, { createContext, useEffect, useRef, useState } from 'react';
import { GameDataType, GameMetaDataType, GameCacheType, GamePlayType } from './types';
import createReadableStreamLineReader from './lib/readable-stream-line-reader';

type InningStatType = { turnNumber: number, score: number } | null;
export type InningStatsType = { [teamId: string]: InningStatType[][] };

interface GameDataProviderApi {
  available: GameMetaDataType,
  day: string,
  inningStats: InningStatsType,
  season: string,
  seasonSpans: { [season: string]: number[] }
  setDay: (day: string | number) => void,
  setSeason: (season: string) => void,
  streaming: string,
  turnsRef: React.MutableRefObject<GameDataType[]>,
}

const initialGameCache: GameCacheType = { data: {} };
const initialAvailableGames: GameMetaDataType = {};

const initialInningStats = {} as { [teamId: string]: InningStatType[][] };

const initialState: GameDataProviderApi = {
  available: initialAvailableGames,
  day: '',
  inningStats: initialInningStats,
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
  return fetch(`${process.env.PUBLIC_URL}/forbidden-knowledge/${season}/${day}.txt`)
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
  const [inningStats, setInningStats] = useState(initialInningStats);
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

  const updateInningStats = () => {
    if (turns.current.length > 1) {
      const thisTurn = turns.current[turns.current.length - 1];
      const lastTurnIdx = turns.current.length - 2;
      const lastTurn = turns.current[lastTurnIdx];

      // performance: avoid doing Array.find() 10 times per line received
      type LastTurnMapType = { [id: string]: GamePlayType };
      const lastTurnMap = lastTurn.schedule
        .reduce((memo, play) => ({ ...memo, [play.homeTeam]: play }), {} as LastTurnMapType);

      thisTurn.schedule.forEach((play) => {
        const prevPlay = lastTurnMap[play.homeTeam];
        const newInning = prevPlay.gameStart && (play.topOfInning !== prevPlay.topOfInning);
        const endOfGame = play.gameComplete && !prevPlay.gameComplete;
        let commitInningStats = false;
        if (newInning || endOfGame) {
          if (!inningStats[play.homeTeam]) {
            inningStats[play.homeTeam] = [];
          }

          if (!inningStats[play.homeTeam][prevPlay.inning]) {
            inningStats[play.homeTeam][prevPlay.inning] = [null, null];
          }

          const stats = {
            turnNumber: lastTurnIdx,
            score: prevPlay.topOfInning ? prevPlay.awayScore : prevPlay.homeScore
          };
          inningStats[play.homeTeam][prevPlay.inning][prevPlay.topOfInning ? 0 : 1] = stats;
        }

        if (commitInningStats) {
          setInningStats(inningStats);
        }
      });
    }
  };

  const ingestAvailableGames = (available: GameMetaDataType) => {
    const availableSeasonSpans = Object.keys(available)
      .reduce((memo, season) => ({ ...memo, [season]: seasonSpan(season, available) }), {});

    setSeasonSpans(availableSeasonSpans);
    setAvailableGames(available);
  };

  const fetchAvailableGames = () => {
    console.log(process.env);
    fetch(`${process.env.PUBLIC_URL}/forbidden-knowledge/index.json`)
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
            updateInningStats();
            cacheGame();
            return;
          }

          turns.current.push(JSON.parse(result.value));
          // force re-render once we've got a line of data, don't wait for all of it
          if (turns.current.length % 100 === 1) {
            setStreaming(`s${season}d${day}-${turns.current.length}`);
          }
          updateInningStats();

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
    inningStats,
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
