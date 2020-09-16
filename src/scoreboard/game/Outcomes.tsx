import React from 'react';
import { Grid, List, ListItem, ListItemText } from '@material-ui/core';
import { GamePlayType } from '../../types';
import styles from './index.module.scss';

interface Props {
  play: GamePlayType;
}

function Outcomes({ play }: Props) {
  return (
    <>
      <Grid item xs={1} />
      <Grid item container xs={11} alignContent="center" justify="center">
        <List dense disablePadding>
          {play.outcomes.map((outcome, idx) =>
            <ListItem key={`${play.homeTeam}O${idx}`} className={styles.message}>
              <ListItemText primary={`\u2022 ${outcome}`} primaryTypographyProps={{ variant: "body2" }} />
            </ListItem>
          )}
        </List>
      </Grid>
    </>
  );
}

export default Outcomes;
