import React, { useContext } from 'react';
import { Fade, Grid, Link, Typography } from '@material-ui/core';
import { gameDataContext } from './GameDataProvider';
import styles from './App.module.scss';

function Credits() {
  const { season, streaming } = useContext(gameDataContext);

  return (
    <Fade in={!(!season || streaming)} timeout={{ enter: 4000, exit: 200 }}>
      <Grid container alignContent="center" justify="center" className={styles.credits}>
        <Grid item container xs={12} sm={4} alignContent="center" justify="center" className={styles.credit}>
          <Typography variant="body2" align="center">
            This rebroadcast is without the express written consent of Internet League Blaseball.
        </Typography>
        </Grid>
        <Grid item container xs={12} sm={4} alignContent="center" justify="center" className={styles.credit}>
          <Typography variant="body2" align="center">
            All credit for <Link href="https://www.blaseball.com/">Blaseball</Link> goes
          to <Link href="https://thegameband.com/">The Game Band</Link>. Please
          consider contributing to the cause at their <Link href="https://www.patreon.com/blaseball">Patreon</Link>.
        </Typography>
        </Grid>
        <Grid item container xs={12} sm={4} alignContent="center" justify="center" className={styles.credit}>
          <Typography variant="body2" align="center">
            Credit for data collection and distribution goes to <Link href="https://github.com/iliana/blaseball-archive-scripts">iliana</Link>.
        </Typography>
        </Grid>
      </Grid>
    </Fade>
  );
}

export default Credits;
