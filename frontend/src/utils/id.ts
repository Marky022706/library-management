let counter = 0;

/** Sequential-ish mock id generator, good enough for client-only mock data. */
export function makeId(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
}
