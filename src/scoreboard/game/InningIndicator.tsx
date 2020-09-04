import React from 'react';
import ordinal from '../../lib/ordinal';
import { GamePlayType } from '../../types';
import styles from './InningIndicator.module.scss';


function ExtraInnings({ inning }: { inning: number }) {
  if (inning < 9) {
    return null;
  }

  return (<>&nbsp;({inning + 1})</>);
}

interface Props {
  play: GamePlayType
}

function InningIndicator({ play }: Props) {
  if (!play.gameStart) {
    return (
      <div className={styles.upcoming}>
        Batting Practice
      </div>
    );
  } else if (play.gameComplete) {
    return (
      <>
        <div className={styles.final}>
          Final
          <span className={styles.extrainnings}>
            <ExtraInnings inning={play.inning} />
          </span>
        </div>
        <div className={styles.finalshame}>{play.shame ? `Shame!` : ''}</div>
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
