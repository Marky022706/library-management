/** Simulates network latency so loading states have something real to show in the frontend-only prototype. */
export function wait(ms = 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
