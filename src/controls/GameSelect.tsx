import React, { useContext } from 'react';
import { FormControl, ListSubheader, MenuItem, Select } from '@material-ui/core';
import { gameDataContext } from '../GameDataProvider';
import { clockContext } from '../ClockProvider';
import styles from './index.module.scss';

function GameSelect() {
  const { available, day, season, setDay, setSeason, streaming } = useContext(gameDataContext);
  const { setTurnNumber } = useContext(clockContext);

  const handleSetSeason = (e: any): void => {
    setDay('');
    setSeason(e.target.value);
  };

  const handleSetDay = (e: any): void => {
    setTurnNumber(0);
    setDay(e.target.value);
  };

  // This isn't written as a proper React component because that breaks MaterialUI's select
  const dayMenuItem = (availableDay: string) => {
    const dayIndex = parseInt(availableDay);

    const postseason = available[season][availableDay].postseason;
    const previousDayPostseason = dayIndex > 0 ? available[season][dayIndex - 1]?.postseason : null;

    const items = [];

    // fun blaseball fact: the 99th day of the season is really the -1th game of the postseason
    if (previousDayPostseason?.game === -1) {
      items.push(
        <ListSubheader inset key="playoffs" className={styles.playoffsubheader}>
          Postseason
        </ListSubheader>
      );
    }

    if (postseason?.game === 0) {
      items.push(
        <ListSubheader color="primary" key={`r${postseason.round}g${postseason.game}`} className={styles.playoffsubheader}>
          {postseason.name}
        </ListSubheader>
      );
    }

    const itemText = postseason && (postseason.game >= 0)
      ? `${postseason.round === 2 ? 'IS' : 'R' + (postseason.round + 1)} Game ${postseason.game + 1}`
      : `Day ${dayIndex + 1}`;

    items.push(
      <MenuItem
        className={styles.gamemenuitem}
        key={availableDay}
        value={availableDay}
      >
        {itemText}&nbsp;
      </MenuItem>
    );

    return items;
  };

  return (
    <>
      <FormControl>
        <Select
          autoWidth
          classes={{ root: styles.pick, icon: styles.icon }}
          displayEmpty
          onChange={handleSetSeason}
          value={season}
        >
          <MenuItem value="" className={styles.gamemenuhead}>
            Select Season:&nbsp;
          </MenuItem>
          {Object.keys(available).map((season) =>
            <MenuItem key={season} value={season} className={styles.gamemenuitem}>
              Season {parseInt(season) + 1}&nbsp;
            </MenuItem>
          )}
        </Select>
      </FormControl>
      &nbsp;
      <FormControl>
        <Select
          autoWidth
          classes={{ root: styles.pick, icon: styles.icon }}
          disabled={!(season && !streaming)}
          displayEmpty
          onChange={handleSetDay}
          value={day}
        >
          <MenuItem value="" className={styles.gamemenuhead}>
            Select Day:&nbsp;
          </MenuItem>
          {season && Object.keys(available[season])
            .flatMap((availableDay) => dayMenuItem(availableDay))}
        </Select>
      </FormControl>
    </>
  );
}

export default GameSelect;
