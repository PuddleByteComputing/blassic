import React, { useContext } from 'react';
import { FormControl, Grid, MenuItem, Select } from '@material-ui/core';
import { gameDataContext } from '../GameDataProvider';
import styles from './index.module.scss';

function GameSelect() {
  const { available, day, season, setDay, setSeason, streaming } = useContext(gameDataContext);

  const handleSetSeason = (e: any): void => {
    setDay('');
    setSeason(e.target.value);
  };

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
            {Object.keys(available).map((availableSeason) =>
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
            disabled={!(season && !streaming)}
            displayEmpty
            onChange={handleSetDay}
            value={day}
          >
            <MenuItem value="" key="dayPlaceholder" className={styles.gamemenuitem}>
              Select Day
              </MenuItem>
            {season && Object.keys(available[season]).map((availableDay) =>
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
