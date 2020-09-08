import { DivisionType, LeagueType, SubLeagueType, UUID } from '../types';

// * League/Subleague metadata
// *
// * Hardcoded data from endpoints that haven't changed so far, and thus haven't
// * been included in the forbidden knowledge archives
// *
// * When/if any of this starts changing, we'll have to do something more complicated.
// *
// * see:
// *   https://blaseball.com/database/allDivisions
// *   https://blaseball.com/database/league?id=:id
// *   https://blaseball.com/database/subleague?id=:id
// *

const internetBlaseballLeagueId = "d8545021-e9fc-48a3-af74-48685950a183";

// Note: there is only one known league, but its subleagues have changed
//   from one season to the next.
export const theologyEraLeagues: LeagueType = {
  "id": internetBlaseballLeagueId,
  "name": "Internet League Blaseball",
  "subleagues": [
    "7d3a3dd6-9ea1-4535-9d91-bde875c85e80",
    "93e58443-9617-44d4-8561-e254a1dbd450"
  ],
  "tiebreakers": "72a618ed-c61c-4162-a455-3959a2d0e738"
};

export const domesticationEraLeagues: LeagueType = {
  "id": internetBlaseballLeagueId,
  "name": "Internet League Blaseball",
  "subleagues": [
    "aabc11a1-81af-4036-9f18-229c759ca8a9",
    "4fe65afa-804f-4bb2-9b15-1281b2eab110"
  ],
  "tiebreakers": "72a618ed-c61c-4162-a455-3959a2d0e738"
};

export const league = (season: number | string) =>
  parseInt(season.toString()) < 5 ? theologyEraLeagues : domesticationEraLeagues;

export const goodLeagueId = "7d3a3dd6-9ea1-4535-9d91-bde875c85e80";
export const evilLeagueId = "93e58443-9617-44d4-8561-e254a1dbd450";
export const wildLeagueId = "aabc11a1-81af-4036-9f18-229c759ca8a9";
export const mildLeagueId = "4fe65afa-804f-4bb2-9b15-1281b2eab110";

// NOTE: shortName is not part of the blaseball API, we add it for convenience here
export const subleagues: { [id: string]: SubLeagueType & { shortName: string } } = {
  "7d3a3dd6-9ea1-4535-9d91-bde875c85e80": {
    "id": "7d3a3dd6-9ea1-4535-9d91-bde875c85e80",
    "divisions": [
      "f711d960-dc28-4ae2-9249-e1f320fec7d7",
      "5eb2271a-3e49-48dc-b002-9cb615288836"
    ],
    "name": "The Good League",
    "shortName": "Good",
  },
  "93e58443-9617-44d4-8561-e254a1dbd450": {
    "id": "93e58443-9617-44d4-8561-e254a1dbd450",
    "divisions": [
      "765a1e03-4101-4e8e-b611-389e71d13619",
      "7fbad33c-59ab-4e80-ba63-347177edaa2e"
    ],
    "name": "The Evil League",
    "shortName": "Evil",
  },
  "aabc11a1-81af-4036-9f18-229c759ca8a9": {
    "id": "aabc11a1-81af-4036-9f18-229c759ca8a9",
    "divisions": [
      "d4cc18de-a136-4271-84f1-32516be91a80",
      "98c92da4-0ea7-43be-bd75-c6150e184326"
    ],
    "name": "The Wild League",
    "shortName": "Wild",
  },
  "4fe65afa-804f-4bb2-9b15-1281b2eab110":
  {
    "id": "4fe65afa-804f-4bb2-9b15-1281b2eab110",
    "divisions": [
      "456089f0-f338-4620-a014-9540868789c9",
      "fadc9684-45b3-47a6-b647-3be3f0735a84"
    ],
    "name": "The Mild League",
    "shortName": "Mild",
  }
};

export const allDivisions: DivisionType[] = [
  {
    "id": "d4cc18de-a136-4271-84f1-32516be91a80",
    "teams": [
      "b72f3061-f573-40d7-832a-5ad475bd7909",
      "8d87c468-699a-47a8-b40d-cfb73a5660ad",
      "36569151-a2fb-43c1-9df7-2df512424c82",
      "ca3f1c8c-c025-4d8e-8eef-5be6accbeb16",
      "a37f9158-7f82-46bc-908c-c9e2dda7c33b"
    ],
    "name": "Wild High"
  },
  {
    "id": "98c92da4-0ea7-43be-bd75-c6150e184326",
    "teams": [
      "9debc64f-74b7-4ae1-a4d6-fce0144b6ea5",
      "3f8bbb15-61c0-4e3f-8e4a-907a5fb1565e",
      "b63be8c2-576a-4d6e-8daf-814f8bcea96f",
      "f02aeae2-5e6a-4098-9842-02d2273f25c7",
      "878c1bf6-0d21-4659-bfee-916c8314d69c"
    ],
    "name": "Wild Low"
  },
  {
    "id": "456089f0-f338-4620-a014-9540868789c9",
    "teams": [
      "747b8e4a-7e50-4638-a973-ea7950a3e739",
      "eb67ae5e-c4bf-46ca-bbbc-425cd34182ff",
      "105bc3ff-1320-4e37-8ef0-8d595cb95dd0",
      "b024e975-1c4a-4575-8936-a3754a08806a",
      "adc5b394-8f76-416d-9ce9-813706877b84"
    ],
    "name": "Mild High"
  },
  {
    "id": "fadc9684-45b3-47a6-b647-3be3f0735a84",
    "teams": [
      "57ec08cc-0411-4643-b304-0e80dbc15ac7",
      "979aee4a-6d80-4863-bf1c-ee1a78e06024",
      "23e4cbc1-e9cd-47fa-a35b-bfa06f726cb7",
      "bfd38797-8404-4b38-8b82-341da28b1f83",
      "7966eb04-efcc-499b-8f03-d13916330531"
    ],
    "name": "Mild Low"
  },
  {
    "teams": [
      "eb67ae5e-c4bf-46ca-bbbc-425cd34182ff",
      "9debc64f-74b7-4ae1-a4d6-fce0144b6ea5",
      "b63be8c2-576a-4d6e-8daf-814f8bcea96f",
      "105bc3ff-1320-4e37-8ef0-8d595cb95dd0",
      "a37f9158-7f82-46bc-908c-c9e2dda7c33b"
    ],
    "id": "7fbad33c-59ab-4e80-ba63-347177edaa2e",
    "name": "Chaotic Evil"
  },
  {
    "teams": [
      "8d87c468-699a-47a8-b40d-cfb73a5660ad",
      "23e4cbc1-e9cd-47fa-a35b-bfa06f726cb7",
      "f02aeae2-5e6a-4098-9842-02d2273f25c7",
      "57ec08cc-0411-4643-b304-0e80dbc15ac7",
      "747b8e4a-7e50-4638-a973-ea7950a3e739"
    ],
    "id": "765a1e03-4101-4e8e-b611-389e71d13619",
    "name": "Lawful Evil"
  },
  {
    "teams": [
      "b72f3061-f573-40d7-832a-5ad475bd7909",
      "878c1bf6-0d21-4659-bfee-916c8314d69c",
      "b024e975-1c4a-4575-8936-a3754a08806a",
      "adc5b394-8f76-416d-9ce9-813706877b84",
      "ca3f1c8c-c025-4d8e-8eef-5be6accbeb16"
    ],
    "id": "f711d960-dc28-4ae2-9249-e1f320fec7d7",
    "name": "Lawful Good"
  },
  {
    "teams": [
      "bfd38797-8404-4b38-8b82-341da28b1f83",
      "3f8bbb15-61c0-4e3f-8e4a-907a5fb1565e",
      "979aee4a-6d80-4863-bf1c-ee1a78e06024",
      "7966eb04-efcc-499b-8f03-d13916330531",
      "36569151-a2fb-43c1-9df7-2df512424c82"
    ],
    "id": "5eb2271a-3e49-48dc-b002-9cb615288836",
    "name": "Chaotic Good"
  }
];

// Put it all together
type CombinedSubLeagueDataType = { divisions: DivisionType[], id: UUID, name: string }
type CombinedSubLeaguesDataType = { [id: string]: CombinedSubLeagueDataType }
const combinedSubleaguesData = (season: number | string): CombinedSubLeaguesDataType =>
  league(season)
    .subleagues
    .reduce(
      (subleagueMemo, subleagueId) => ({
        ...subleagueMemo,
        [subleagueId]: {
          ...subleagues[subleagueId],
          divisions: subleagues[subleagueId].divisions.map((divisionID) =>
            allDivisions.find((division) => division.id === divisionID))
        }
      }),
      {});

// map team ids to subLeague / division
export const teamsToLeagues = (season: number | string) =>
  Object.values(combinedSubleaguesData(season))
    .flatMap((subLeague) =>
      subLeague.divisions
        .flatMap((division) =>
          division.teams
            .map((teamId) => ({ [teamId]: { subLeague, division } }))
        )
    )
    .reduce((memo, record) => ({ ...memo, ...record }), {});

export const teamSubleagueId = (teamId: UUID, season: string | number) =>
  teamsToLeagues(season)?.[teamId]?.subLeague?.id;
