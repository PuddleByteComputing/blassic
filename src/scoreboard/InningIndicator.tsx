import React from 'react';
import ordinal from '../lib/ordinal';
import { GameTurnType } from '../lib/blaseball-api-types';
import styles from './InningIndicator.module.scss';

interface Props {
  play: GameTurnType
}

function InningIndicator({ play }: Props) {
  if (!play.gameStart) {
    return null;
  } else if (play.finalized) {
    return (
      <>
        <div className={styles.final}>
          Final
          <span className={styles.extrainnings}>
            {play.inning > 8 ? [<>&nbsp;</>, '(', play.inning + 1, ')'] : ''}
          </span>
        </div>
        <div className={styles.finalshame}>{play.shame ? `The ${play.awayTeamNickname} were shamed!` : ''}</div>
      </>
    );
  } else if (play.shame) {
    return (<div className={styles.shame}>Shame</div>);
  } else {
    return (
      <div className={styles.playing}>
        <span className={play.topOfInning ? styles.uparrow : styles.downarrow}>
          {play.topOfInning ? "\u25B2" : "\u25BC"}
        </span>&nbsp;
        {ordinal(play.inning + 1)}
      </div>
    );
  }
}

export default InningIndicator;
