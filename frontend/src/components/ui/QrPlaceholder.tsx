import { useMemo } from 'react';
import { cn } from '@/utils/cn';

export interface QrPlaceholderProps {
  /** The value this mock QR code "encodes" — determines the generated pattern deterministically. */
  value: string;
  size?: number;
  className?: string;
}

const GRID = 9;

// Simple deterministic string hash (djb2) → 32-bit seed.
function hashString(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return hash >>> 0;
}

// mulberry32 PRNG — deterministic, seed-based.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function isFinderCell(row: number, col: number): boolean {
  const corners: [number, number][] = [
    [0, 0],
    [0, GRID - 3],
    [GRID - 3, 0],
  ];
  return corners.some(([r, c]) => row >= r && row < r + 3 && col >= c && col < c + 3);
}

function buildGrid(seed: string): boolean[][] {
  const rand = mulberry32(hashString(seed));
  const cells: boolean[][] = [];
  for (let row = 0; row < GRID; row++) {
    const rowCells: boolean[] = [];
    for (let col = 0; col < GRID; col++) {
      if (isFinderCell(row, col)) {
        rowCells.push(true); // filled in separately as finder squares
      } else {
        rowCells.push(rand() > 0.55);
      }
    }
    cells.push(rowCells);
  }
  return cells;
}

/**
 * Deterministic, purely visual stand-in for a real QR code. The pattern is derived
 * from `value` so the same id always renders the same "code". Real QR generation
 * and scanning will be implemented once the backend exists.
 */
export function QrPlaceholder({ value, size = 160, className }: QrPlaceholderProps) {
  const grid = useMemo(() => buildGrid(value), [value]);
  const cell = size / GRID;

  return (
    <div className={cn('inline-flex flex-col items-center gap-2', className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`QR code for ${value}`} className="rounded-md bg-white p-1 ring-1 ring-gray-200">
        <rect x={0} y={0} width={size} height={size} fill="white" />
        {grid.map((row, r) =>
          row.map((filled, c) => {
            if (!filled) return null;
            const isFinder = isFinderCell(r, c);
            return (
              <rect
                key={`${r}-${c}`}
                x={c * cell}
                y={r * cell}
                width={cell}
                height={cell}
                fill={isFinder ? '#184029' : '#1c4d30'}
              />
            );
          }),
        )}
        {/* Finder square "eyes" for visual authenticity */}
        {[
          [0, 0],
          [0, GRID - 3],
          [GRID - 3, 0],
        ].map(([r, c]) => (
          <rect key={`eye-${r}-${c}`} x={(c + 1) * cell} y={(r + 1) * cell} width={cell} height={cell} fill="white" />
        ))}
      </svg>
      <span className="font-mono text-[10px] uppercase tracking-wider text-gray-400">{value}</span>
    </div>
  );
}
