import { GameDataType } from './blaseball-api';
export * from './blaseball-api';

export interface GameCacheType {
  data: {
    [season: string]: {
      [day: string]: GameDataType[]
    },
  },
}

export interface GameMetaDataType {
  [season: string]: {
    [day: string]: {
      turns: number,
      complete: boolean,
      postseason?: { game: number, name: string, round: number },
      started: boolean,
    }
  }
}

export interface TeamStandingsType {
  l: number,
  w: number,
  avg: number
}

export interface StandingsMapType {
  [teamId: string]: TeamStandingsType
}
