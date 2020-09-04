import { GamePlayType } from '../types';
import { teamIsEvil, teamIsGood } from './leagues';

export const isAbomination = (play: GamePlayType) =>
  teamIsEvil(play.awayTeam) === teamIsGood(play.homeTeam);
