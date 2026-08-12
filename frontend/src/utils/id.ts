/** Lightweight id generator for mock records. Swap for database-assigned ids once the backend exists. */
let counter = 0;

export function generateId(prefix = 'id'): string {
  counter += 1;
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}${counter}${random}`;
}
