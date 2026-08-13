/**
 * All "today" logic in this mock app is pinned to a fixed reference date
 * (matching the reference screenshots) rather than the real system clock, so
 * the demo data doesn't go stale/empty when opened on a different real date.
 */
export const MOCK_TODAY = '2025-08-11';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const longDateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short' });

/** "2025-08-08" -> "Aug 8, 2025" */
export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(`${iso}T00:00:00`));
}

/** "2025-08-11" -> "Monday, August 11, 2025" */
export function formatLongDate(iso: string): string {
  return longDateFormatter.format(new Date(`${iso}T00:00:00`));
}

/** "2025-08-08" -> "Aug" */
export function formatMonth(iso: string): string {
  return monthFormatter.format(new Date(`${iso}T00:00:00`));
}

/** Minutes between two "HH:mm" times. */
export function minutesBetween(timeIn: string, timeOut: string): number {
  const [inH, inM] = timeIn.split(':').map(Number);
  const [outH, outM] = timeOut.split(':').map(Number);
  return outH * 60 + outM - (inH * 60 + inM);
}

/** 105 -> "1h 45m" */
export function formatDuration(totalMinutes: number): string {
  if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) return '0m';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export function isBefore(isoA: string, isoB: string): boolean {
  return isoA < isoB;
}

/** Whole days from `fromIso` to `toIso` — negative when `toIso` is in the past. */
export function daysBetween(fromIso: string, toIso: string): number {
  const from = new Date(`${fromIso}T00:00:00`);
  const to = new Date(`${toIso}T00:00:00`);
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}
