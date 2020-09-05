import React, { useContext } from 'react';
import { Grid, Hidden, Link } from '@material-ui/core';
import { gameDataContext } from './GameDataProvider';
import styles from './App.module.scss';

function Splash() {
  const { turns } = useContext(gameDataContext);
  if (turns.length > 0) {
    return (<></>);
  }

  return (
    <Grid container className={styles.splash}>
      <Grid item md={3} />
      <Grid item xs={12} md={6} className={styles.title}>
        Blaseball <span className={styles.classic}>Classic</span>
        <div className={styles.subtitle}>
          Relive your favorite <Link href="https://www.blaseball.com">Blaseball</Link> Games
        </div>
        <Grid item md={3} />
      </Grid>
      <Grid item container alignContent="center" justify="center">
        <span>Select a Season and Day to&nbsp;</span>
        <Hidden smUp><br /></Hidden>
        <span>replay some classic Blaseball!</span>
      </Grid>
    </Grid>
  );
}

export default Splash;
