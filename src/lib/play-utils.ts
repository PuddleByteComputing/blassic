import { GamePlayType } from '../types';
import { teamIsEvil, teamIsGood } from './leagues';

export const isAbomination = (play: GamePlayType) =>
  teamIsEvil(play.awayTeam) === teamIsGood(play.homeTeam);

function homeTeamCompare(a: GamePlayType, b: GamePlayType, standingsMap): number {
  const aIsAbomination = isAbomination(a);
  const bIsAbomination = isAbomination(b);

  if (aIsAbomination !== bIsAbomination) {
    return (aIsAbomination ? -1 : 1);
  }

  // const aRecord =
  return 0;
}
