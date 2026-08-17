import { useState } from 'react';

type TimeRange = '7d' | '30d' | '6m' | '1y';

interface DataPoint {
  label: string;
  borrowed: number;
  returned: number;
  overdue: number;
}

const DATA_BY_RANGE: Record<TimeRange, DataPoint[]> = {
  '7d': [
    { label: 'Mon', borrowed: 24, returned: 18, overdue: 2 },
    { label: 'Tue', borrowed: 32, returned: 22, overdue: 4 },
    { label: 'Wed', borrowed: 28, returned: 25, overdue: 1 },
    { label: 'Thu', borrowed: 40, returned: 30, overdue: 3 },
    { label: 'Fri', borrowed: 48, returned: 35, overdue: 5 },
    { label: 'Sat', borrowed: 55, returned: 42, overdue: 4 },
    { label: 'Sun', borrowed: 20, returned: 15, overdue: 1 },
  ],
  '30d': [
    { label: 'Week 1', borrowed: 180, returned: 145, overdue: 12 },
    { label: 'Week 2', borrowed: 210, returned: 175, overdue: 18 },
    { label: 'Week 3', borrowed: 195, returned: 160, overdue: 15 },
    { label: 'Week 4', borrowed: 240, returned: 190, overdue: 22 },
  ],
  '6m': [
    { label: 'Mar', borrowed: 620, returned: 540, overdue: 45 },
    { label: 'Apr', borrowed: 710, returned: 630, overdue: 52 },
    { label: 'May', borrowed: 680, returned: 610, overdue: 40 },
    { label: 'Jun', borrowed: 820, returned: 740, overdue: 61 },
    { label: 'Jul', borrowed: 890, returned: 800, overdue: 58 },
    { label: 'Aug', borrowed: 950, returned: 870, overdue: 64 },
  ],
  '1y': [
    { label: 'Q1', borrowed: 1980, returned: 1720, overdue: 130 },
    { label: 'Q2', borrowed: 2350, returned: 2080, overdue: 165 },
    { label: 'Q3', borrowed: 2640, returned: 2310, overdue: 180 },
    { label: 'Q4', borrowed: 2890, returned: 2550, overdue: 195 },
  ],
};

export function BorrowingTrendsChart() {
  const [range, setRange] = useState<TimeRange>('7d');
  const points = DATA_BY_RANGE[range];

  const maxVal = Math.max(...points.map((p) => Math.max(p.borrowed, p.returned, p.overdue))) * 1.15;

  return (
    <div className="flex flex-col gap-4">
      {/* Filter and legend header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <span className="h-3 w-3 rounded-full bg-emerald-600"></span>
            <span>Borrowed</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <span className="h-3 w-3 rounded-full bg-blue-500"></span>
            <span>Returned</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <span className="h-3 w-3 rounded-full bg-rose-500"></span>
            <span>Overdue</span>
          </div>
        </div>

        {/* Range Buttons */}
        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-0.5 text-xs font-medium">
          {(['7d', '30d', '6m', '1y'] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-lg px-2.5 py-1 transition-all ${
                range === r
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : r === '6m' ? '6 Months' : '1 Year'}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Multi-bar & Trend Histogram Chart */}
      <div className="relative h-56 w-full pt-4">
        <div className="flex h-44 items-end justify-between gap-2 sm:gap-4 border-b border-slate-200 pb-2">
          {points.map((p, idx) => {
            const borrowedHeight = (p.borrowed / maxVal) * 100;
            const returnedHeight = (p.returned / maxVal) * 100;
            const overdueHeight = (p.overdue / maxVal) * 100;

            return (
              <div key={idx} className="group relative flex h-full flex-1 flex-col items-center justify-end">
                {/* Tooltip on hover */}
                <div className="pointer-events-none absolute -top-12 z-20 hidden rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] text-white shadow-md group-hover:flex flex-col whitespace-nowrap">
                  <span className="font-semibold text-emerald-400">{p.label}</span>
                  <span>Borrowed: {p.borrowed} | Returned: {p.returned} | Overdue: {p.overdue}</span>
                </div>

                {/* Triple bar group */}
                <div className="flex h-full w-full max-w-12 items-end justify-center gap-1 sm:gap-1.5">
                  <div
                    style={{ height: `${borrowedHeight}%` }}
                    className="w-full rounded-t-md bg-emerald-600 transition-all duration-300 group-hover:bg-emerald-700"
                  />
                  <div
                    style={{ height: `${returnedHeight}%` }}
                    className="w-full rounded-t-md bg-blue-500 transition-all duration-300 group-hover:bg-blue-600"
                  />
                  <div
                    style={{ height: `${overdueHeight}%` }}
                    className="w-full rounded-t-md bg-rose-500 transition-all duration-300 group-hover:bg-rose-600"
                  />
                </div>
                <span className="mt-2 text-[11px] font-medium text-slate-500">{p.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
