type ClassValue = string | number | bigint | null | boolean | undefined | Record<string, boolean | null | undefined> | ClassValue[];

function flatten(value: ClassValue, out: string[]): void {
  if (!value && value !== 0 && value !== 0n) return;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint') {
    out.push(String(value));
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) flatten(item, out);
    return;
  }
  if (typeof value === 'object') {
    for (const key of Object.keys(value)) {
      if (value[key]) out.push(key);
    }
  }
}

/** Merge conditional class names, similar to `clsx`, without adding a dependency. */
export function cn(...values: ClassValue[]): string {
  const out: string[] = [];
  for (const value of values) flatten(value, out);
  return out.join(' ');
}
