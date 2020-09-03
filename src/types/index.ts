import { GameDataType } from './blaseball-api';
export * from './blaseball-api';

export interface GameStoreType {
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
      completed: boolean,
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
