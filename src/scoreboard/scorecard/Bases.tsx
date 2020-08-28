import React from 'react';
import styles from './Bases.module.scss';

interface Props {
  baseRunners: string[],
  basesOccupied: number[]
}

const diamondHeight = 100;
const pad = 10;
const diagonalPad = pad * Math.sqrt(2);
const baseDiag = (diamondHeight - diagonalPad) / 2;
const baseSide = baseDiag / Math.sqrt(2);
const diamondWidth = 2 * baseDiag + diagonalPad;
const viewBox = [
  -pad,
  -(diamondHeight / 2 + pad),
  diamondWidth + 2 * pad,
  diamondHeight - (baseDiag + diagonalPad) / 2 + 2 * pad
];

function Bases({ baseRunners, basesOccupied }: Props) {
  const baseMap = basesOccupied.slice(1)
    .reduce((memo, base, i) => ({ ...memo, [(base + 1).toString()]: baseRunners[i] || '' }),
      { '1': '', '2': '', '3': '' });

  if (basesOccupied.length > 1) { console.log(baseMap); }

  return (
    <svg viewBox={viewBox.join(" ")} className={styles.diamond}>
      <g transform="rotate(-45)">
        <rect
          className={baseMap['1'] ? styles.occupied : styles.empty}
          width={baseSide}
          height={baseSide}
          x={pad + baseSide}
          y={pad + baseSide}
        />
        <rect
          className={baseMap['2'] ? styles.occupied : styles.empty}
          width={baseSide}
          height={baseSide}
          x={pad + baseSide}
          y={0}
        />
        <rect
          className={baseMap['3'] ? styles.occupied : styles.empty}
          height={baseSide}
          width={baseSide}
          x={0}
          y={0}
        />
      </g>
    </svg>
  );
}

export default Bases;
