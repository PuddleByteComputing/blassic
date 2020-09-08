import { GameDataType, GamePlayType, StandingsMapType } from '../types';
import { isAbomination } from './play-utils';

export function mapTeamsToStandings(gameData: GameDataType) {
  const lossMap = gameData.standings.losses;
  const winMap = gameData.standings.wins;

  return Object.keys(lossMap)
    .reduce((memo, id) => ({
      ...memo, [id]: {
        l: lossMap[id],
        w: winMap[id],
        avg: winMap[id] / ((winMap[id] + lossMap[id]) || 1)
      }
    }), {} as StandingsMapType);
}

function homeTeamCompare(a: GamePlayType, b: GamePlayType, standingsMap: StandingsMapType): number {
  const aIsAbomination = isAbomination(a);
  const bIsAbomination = isAbomination(b);

  if (aIsAbomination !== bIsAbomination) {
    return (bIsAbomination ? -1 : 1);
  }

  if (standingsMap[a.homeTeam]?.avg !== standingsMap[b.homeTeam]?.avg) {
    return (standingsMap[a.homeTeam]?.avg > standingsMap[b.homeTeam]?.avg ? -1 : 1);
  }

  return (a.homeTeamName > b.homeTeamName ? 1 : -1);
}

export function playComparator(gameData: GameDataType, standingsMap?: StandingsMapType) {
  return (a: GamePlayType, b: GamePlayType) =>
    homeTeamCompare(a, b, standingsMap || mapTeamsToStandings(gameData));
}
