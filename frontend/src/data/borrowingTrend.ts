export interface MonthlyBorrowing {
  month: string;
  count: number;
}

// Standalone historical trend — the last 6 months of circulation totals.
// Not derived from `requests` (which only models the current in-flight
// requests), the same way a real reporting endpoint would aggregate months
// of closed-out circulation data separately from the live requests queue.
export const borrowingTrend: MonthlyBorrowing[] = [
  { month: 'Mar', count: 18 },
  { month: 'Apr', count: 24 },
  { month: 'May', count: 21 },
  { month: 'Jun', count: 30 },
  { month: 'Jul', count: 27 },
  { month: 'Aug', count: 14 },
];
