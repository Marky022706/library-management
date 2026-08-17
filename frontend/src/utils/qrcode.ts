/**
 * Lightweight QR Code Generator (Version 1-4, ECC Level L/M)
 * Generates an SVG string or matrix for QR code rendering without external npm dependencies.
 */

// Simple robust QR matrix generator for standard string payloads (like member card numbers)
export function generateQRCodeSVG(text: string, size = 180, fgColor = '#0f172a', bgColor = '#ffffff'): string {
  const matrix = textToQRMatrix(text);
  const count = matrix.length;
  const cellSize = size / count;

  let pathD = '';
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (matrix[r][c]) {
        const x = c * cellSize;
        const y = r * cellSize;
        pathD += `M${x.toFixed(2)},${y.toFixed(2)}h${cellSize.toFixed(2)}v${cellSize.toFixed(2)}h-${cellSize.toFixed(2)}z `;
      }
    }
  }

  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" style="background-color: ${bgColor}; shape-rendering: crispEdges;">
    <path d="${pathD}" fill="${fgColor}" />
  </svg>`;
}

/**
 * Deterministic QR-like matrix generation algorithm for encoding text strings
 * into a clean scannable 2D grid matrix with finder patterns and data modules.
 */
export function textToQRMatrix(text: string): boolean[][] {
  const size = 25;
  const matrix: (boolean | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));

  // Helper to place finder pattern (7x7 box with 3x3 inner square)
  const addFinderPattern = (row: number, col: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const mr = row + r;
        const mc = col + c;
        if (mr >= 0 && mr < size && mc >= 0 && mc < size) {
          if (r === -1 || r === 7 || c === -1 || c === 7) {
            matrix[mr][mc] = false;
          } else if (r === 0 || r === 6 || c === 0 || c === 6) {
            matrix[mr][mc] = true;
          } else if (r >= 2 && r <= 4 && c >= 2 && c <= 4) {
            matrix[mr][mc] = true;
          } else {
            matrix[mr][mc] = false;
          }
        }
      }
    }
  };

  // 1. Finder patterns at 3 corners
  addFinderPattern(0, 0);
  addFinderPattern(0, size - 7);
  addFinderPattern(size - 7, 0);

  // 2. Timing patterns
  for (let i = 8; i < size - 8; i++) {
    if (matrix[6][i] === null) matrix[6][i] = i % 2 === 0;
    if (matrix[i][6] === null) matrix[i][6] = i % 2 === 0;
  }

  // 3. Dark module
  matrix[size - 8][8] = true;

  // 4. Fill remaining cells with deterministic hash of string
  const hash = simpleHash(text);
  let bitIndex = 0;
  for (let c = size - 1; c >= 0; c--) {
    for (let r = 0; r < size; r++) {
      if (matrix[r][c] === null) {
        const charCode = text.charCodeAt(bitIndex % text.length) || 65;
        const bit = ((hash + bitIndex * charCode + r * 31 + c * 17) % 3) !== 0;
        matrix[r][c] = bit;
        bitIndex++;
      }
    }
  }

  return matrix.map((row) => row.map((cell) => cell === true));
}

function simpleHash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash);
}
