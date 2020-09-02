import React from 'react';
import { FormControl, Grid, MenuItem, Select } from '@material-ui/core';
import { GameMetaDataType } from '../types';
import styles from './index.module.scss';

interface Props {
  day: string,
  gameIndex: GameMetaDataType,
  season: string,
  setDay: (day: string) => void,
  setSeason: (season: string) => void,
}

function GameSelect({ gameIndex, day, setDay, season, setSeason }: Props) {
  const handleSetSeason = (e: any): void => setSeason(e.target.value);
  const handleSetDay = (e: any): void => setDay(e.target.value);

  return (
    <>
      <Grid item xs={6} md={4}>
        <FormControl className={styles.gamepicker}>
          <Select
            classes={{ root: styles.pickseason }}
            displayEmpty
            onChange={handleSetSeason}
            value={season}
          >
            <MenuItem value="" key="seasonPlaceholder" className={styles.gamemenuitem}>
              Select Season
              </MenuItem>
            {Object.keys(gameIndex).map((availableSeason) =>
              <MenuItem
                className={styles.gamemenuitem}
                key={availableSeason}
                value={availableSeason}
              >
                Season {parseInt(availableSeason) + 1}
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6} md={4}>
        <FormControl className={styles.gamepicker}>
          <Select
            classes={{ root: styles.pickday }}
            disabled={!season}
            displayEmpty
            onChange={handleSetDay}
            value={day}
          >
            <MenuItem value="" key="dayPlaceholder" className={styles.gamemenuitem}>
              Select Day
              </MenuItem>
            {season && Object.keys(gameIndex[season]).map((availableDay) =>
              <MenuItem
                className={styles.gamemenuitem}
                key={availableDay}
                value={availableDay}
              >
                Day {parseInt(availableDay) + 1}
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </Grid>
    </>
  );
}

export default GameSelect;
