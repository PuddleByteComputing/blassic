import { GamePlayType } from '../types';
import { teamSubleagueId } from './leagues';

export const isAbomination = (play: GamePlayType) =>
  teamSubleagueId(play.awayTeam, play.season) !== teamSubleagueId(play.homeTeam, play.season);
