import React, { useContext } from 'react';
import { List, ListItem, ListItemText } from '@material-ui/core';
import { clockContext } from '../../ClockProvider';
import { gameDataContext } from '../../GameDataProvider';
import { UUID } from '../../types';
import styles from './index.module.scss';

const maxPlayingMessages = 3;

// You don't need to watch more than one foul ball with two strikes, do you?
function naiveDedupe<T>(arr: Array<T>): Array<T> {
  return arr.filter((elem, idx) => idx < arr.length - 1 && elem !== arr[idx + 1]);
}

interface Props {
  teamId: UUID,
}

function PlayByPlay({ teamId }: Props) {
  const { turnsRef } = useContext(gameDataContext);
  const { turnNumber, playing } = useContext(clockContext);

  const messages = [];
  const firstTurnIdx = playing ? Math.max(0, turnNumber - maxPlayingMessages) : 0;

  for (let i = turnNumber; i >= firstTurnIdx; i--) {
    messages.push(turnsRef.current[i]?.schedule?.find((play) => play.homeTeam === teamId)?.lastUpdate);
  }

  return (
    <List disablePadding classes={{ root: styles[`${playing ? '' : 'paused'}messages`] }}>
      {naiveDedupe(messages).map((msg, idx) =>
        <ListItem key={`m${turnNumber - idx}`} className={styles.message}>
          <ListItemText primary={msg} primaryTypographyProps={{ variant: "body2" }} />
        </ListItem>
      )}
    </List>
  );
}

export default PlayByPlay;
