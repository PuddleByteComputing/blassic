import React, { createContext, useEffect, useRef, useState } from 'react';
import { GameDataType, GameMetaDataType, GameCacheType, GamePlayType } from './types';
import createReadableStreamLineReader from './lib/readable-stream-line-reader';

type InningStatsType = { turnNumber: number, score: number, shamePit?: number } | null;
export type GameStatsType = InningStatsType[][];
type StatsType = { [teamId: string]: GameStatsType };

interface GameDataProviderApi {
  available: GameMetaDataType,
  day: string,
  getGameStats: (teamId: string) => GameStatsType,
  lastRefresh: number,
  season: string,
  seasonSpans: { [season: string]: number[] }
  setDay: (day: string | number) => void,
  setSeason: (season: string) => void,
  streaming: string,
  turnsRef: React.MutableRefObject<GameDataType[]>,
}

const initialGameCache: GameCacheType = { data: {} };
const initialAvailableGames: GameMetaDataType = {};
const initialStatsCache = {} as { [seasonId: string]: { [dayId: string]: StatsType } };

const initialState: GameDataProviderApi = {
  available: initialAvailableGames,
  day: '',
  inningStats: (_id: string) => ({}),
  lastRefresh: Date.now(),
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
  const [lastRefresh, setLastRefresh] = useState(initialState.lastRefresh);
  const refresh = () => setLastRefresh(Date.now());
  const [day, setDay] = useState('');
  const [season, setSeason] = useState('');
  const [seasonSpans, setSeasonSpans] = useState({} as { [seasonId: string]: number[] });
  const statsCache = useRef(initialStatsCache);
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

  const gameStartStats = () =>
    (turns.current[0]?.schedule || [])
      .reduce((memo, play) => {
        memo[play.homeTeam] = [[
          { turnNumber: 0, score: play.awayScore },
          { turnNumber: 0, score: play.homeScore }
        ]];
        return memo;
      }, {} as StatsType);

  const updateStats = () => {
    statsCache.current[season] = (statsCache.current[season] || {});
    if (turns.current.length === 1) {
      statsCache.current[season][day] = gameStartStats();
    } else if (turns.current.length > 1) {
      const thisTurn = turns.current[turns.current.length - 1];
      const lastTurnIdx = turns.current.length - 2;
      const lastTurn = turns.current[lastTurnIdx];

      // performance: avoid doing Array.find() 10 times per line received
      type LastTurnMapType = { [id: string]: GamePlayType };
      const lastTurnMap = lastTurn.schedule
        .reduce((memo, play) => {
          memo[play.homeTeam] = play;
          return memo;
        }, {} as LastTurnMapType);

      thisTurn.schedule.forEach((play) => {
        const prevPlay = lastTurnMap[play.homeTeam];
        const newInning = prevPlay.gameStart && (play.topOfInning !== prevPlay.topOfInning);
        const endOfGame = play.gameComplete && !prevPlay.gameComplete;
        const [s, d, gameId, inningIdx] = [season, day, play.homeTeam, prevPlay.inning + 1];
        if (newInning || endOfGame) {
          statsCache.current[s][d][gameId] = (statsCache.current[s][d][gameId] || []);
          statsCache.current[s][d][gameId][inningIdx] = (statsCache.current[s][d][gameId][inningIdx] || [null, null]);

          const stats = {
            turnNumber: lastTurnIdx,
            score: prevPlay.topOfInning ? prevPlay.awayScore : prevPlay.homeScore
          };
          statsCache.current[s][d][gameId][inningIdx][prevPlay.topOfInning ? 0 : 1] = stats;
        } else if (play.lastUpdate.match(/The Shame Pit activates/)) {
          // @ts-ignore we know from our data that this key will exist; typescript doesn't
          statsCache.current[s][d][gameId][0][prevPlay.topOfInning ? 0 : 1].shamePit =
            play.topOfInning ? play.awayScore : play.homeScore;
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
        if (!lineReader) { return }

        lineReader.read().then(function processLine(result) {
          if (result.done) {
            setStreaming('');
            updateStats();
            cacheGame();
            refresh();
            return;
          }

          turns.current.push(JSON.parse(result.value));
          updateStats();
          // force re-render once we've got a line of data, don't wait for all of it
          if (turns.current.length % 100 === 1) {
            refresh();
          }

          lineReader.read().then(processLine);
        });
      });
  };

  const setGame = () => {
    if (!(season && day)) { return }

    if (cache.data?.[season]?.[day]) {
      turns.current = [...cache.data[season][day]];
      refresh();
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
    getGameStats: (id: string) => (statsCache.current[season]?.[day]?.[id] || []),
    lastRefresh,
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
