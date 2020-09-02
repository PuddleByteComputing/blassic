export type ISO8601String = string;
export type UUID = string;
export type ColorStringType = string;
export type EmojiType = string;

export interface LeagueType {
  _id: UUID,
  name: string,
  tiebreakers: UUID,
  subleagues: UUID[]
};

export interface SubLeagueType {
  id: UUID,
  name: string,
  divisions: UUID[]
};

export interface DivisionType {
  _id: UUID,
  name: string,
  teams: UUID[]
};

//
// types for game data websocket updates
//

export interface SeasonType {
  league: UUID,
  rules: UUID,
  schedule: UUID,
  seasonNumber: number,
  standings: UUID,
  stats: UUID,
  terminology: UUID,
  __v: number,
  _id: UUID,
}

export interface SimType {
  day: number,
  doTheThing: boolean,
  eraColor: ColorStringType,
  eraTitle: string,
  labourOne: number,
  league: UUID,
  nextElectionEnd: ISO8601String,
  nextPhaseTime: ISO8601String,
  nextSeasonStart: ISO8601String,
  openedBook: boolean,
  phase: number,
  playOffRound: number,
  playoffs: UUID,
  rules: UUID,
  season: 2,
  seasonId: UUID,
  subEraColor: ColorStringType,
  subEraTitle: string,
  terminology: UUID,
  twgo: string,
  unlockedPeanuts: boolean,
  __v: 0,
  _id: "thisidisstaticyo",
}

export interface StandingsType {
  losses: { [teamId: string]: number }[],
  wins: { [teamId: string]: number }[],
}

interface PlayoffsType {
  __v: number,
  _id: UUID,
  name: string,
  numberOfRounds: number,
  playoffDay: number,
  rounds: UUID[],
  season: number,
  tomorrowRound: number,
}

interface RoundType {
  __v: number,
  _id: UUID,
  gameIndex: number,
  games: UUID[][],
  matchups: UUID[],
  name: string,
  roundNumber: number,
  special: boolean,
  winnerSeeds: number[],
  winners: UUID[],
}

interface MatchupType {
  _id: UUID,
  __v: number,
  awaySeed: number,
  awayTeam: UUID,
  awayWins: number,
  homeSeed: number,
  homeTeam: UUID,
  homeWins: 1,
}

export interface PostSeasonType {
  matchups: MatchupType[],
  playoffs: PlayoffsType | false,
  round: RoundType,
  tomorrowMatchups: MatchupType[],
  tomorrowRound: RoundType,
}

export interface GameTurnType {
  atBatBalls: number,
  atBatStrikes: number,
  awayBatter: UUID | null,
  awayBatterName: string,
  awayOdds: number,
  awayPitcher: UUID | null,
  awayPitcherName: string,
  awayScore: number,
  awayStrikes: number,
  awayTeam: UUID,
  awayTeamBatterCount: number,
  awayTeamColor: ColorStringType,
  awayTeamEmoji: EmojiType,
  awayTeamName: string,
  awayTeamNickname: string,
  baseRunners: UUID[]
  baserunnerCount: 0
  basesOccupied: number[]
  day: number,
  finalized: boolean,
  gameComplete: boolean,
  gameStart: boolean,
  halfInningOuts: number,
  halfInningScore: number,
  homeBatter: UUID | null,
  homeBatterName: string,
  homeOdds: number,
  homePitcher: UUID | null,
  homePitcherName: string,
  homeScore: number,
  homeStrikes: number,
  homeTeam: UUID,
  homeTeamBatterCount: number,
  homeTeamColor: ColorStringType,
  homeTeamEmoji: EmojiType,
  homeTeamName: string,
  homeTeamNickname: string,
  inning: number,
  isPostseason: boolean,
  lastUpdate: string,
  outcomes: [] // TODO
  phase: number,
  rules: UUID,
  season: number,
  seriesIndex: number,
  seriesLength: number,
  shame: boolean,
  statsheet: UUID,
  terminology: UUID,
  topOfInning: boolean,
  weather: number,
  _id: UUID
}

export interface GameDataType {
  postseason: PostSeasonType,
  schedule: GameTurnType[],
  season: SeasonType,
  sim: SimType,
  standings: StandingsType,
  tomorrowSchedule: GameTurnType[],
};
