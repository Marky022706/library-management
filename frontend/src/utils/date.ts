/** Date helpers used throughout the frontend prototype. All dates are stored as ISO 8601 strings. */

export function today(): Date {
  return new Date();
}

export function isoDate(date: Date): string {
  return date.toISOString();
}

export function addDays(date: Date | string, days: number): Date {
  const base = typeof date === 'string' ? new Date(date) : new Date(date.getTime());
  base.setDate(base.getDate() + days);
  return base;
}

export function daysBetween(a: Date | string, b: Date | string): number {
  const start = typeof a === 'string' ? new Date(a) : a;
  const end = typeof b === 'string' ? new Date(b) : b;
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((end.getTime() - start.getTime()) / msPerDay);
}

export function formatDate(value: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', options ?? { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDateTime(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatTime(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function timeAgo(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (Math.abs(seconds) < 60) {
    return rtf.format(-Math.round(seconds), 'second');
  }

  const units: Intl.RelativeTimeFormatUnit[] = ['minute', 'hour', 'day', 'week', 'month', 'year'];
  const divisors = [60, 24, 7, 4.34524, 12];
  let duration = seconds / 60;
  let unit: Intl.RelativeTimeFormatUnit = 'minute';

  for (let i = 0; i < divisors.length; i++) {
    if (Math.abs(duration) < divisors[i]) {
      unit = units[i];
      break;
    }
    duration = duration / divisors[i];
    unit = units[i + 1];
  }

  return rtf.format(-Math.round(duration), unit);
}

export function isPast(value: string | Date): boolean {
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.getTime() < Date.now();
}

/** ISO string `n` days ago from now (negative `n` means `n` days in the future). Handy for mock data. */
export function daysAgo(n: number): string {
  return isoDate(addDays(new Date(), -n));
}

/** ISO string `n` days from now. Handy for mock data. */
export function daysFromNow(n: number): string {
  return isoDate(addDays(new Date(), n));
}
