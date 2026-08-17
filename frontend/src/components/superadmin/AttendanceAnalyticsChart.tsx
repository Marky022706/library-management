const DAYS = [
  { day: 'Mon', count: 142, peak: '10 AM - 12 PM' },
  { day: 'Tue', count: 185, peak: '1 PM - 3 PM' },
  { day: 'Wed', count: 160, peak: '9 AM - 11 AM' },
  { day: 'Thu', count: 198, peak: '2 PM - 4 PM' },
  { day: 'Fri', count: 230, peak: '1 PM - 5 PM' },
  { day: 'Sat', count: 265, peak: '10 AM - 3 PM' },
  { day: 'Sun', count: 95, peak: '1 PM - 3 PM' },
];

export function AttendanceAnalyticsChart() {
  const max = Math.max(...DAYS.map((d) => d.count)) * 1.1;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="font-medium text-slate-700">Weekly Visitor Footfall</span>
        <span>Average: <strong>182 / day</strong></span>
      </div>

      <div className="flex h-44 items-end justify-between gap-2 border-b border-slate-200 pb-2">
        {DAYS.map((item, idx) => {
          const height = (item.count / max) * 100;
          return (
            <div key={idx} className="group relative flex h-full flex-1 flex-col items-center justify-end">
              {/* Tooltip */}
              <div className="pointer-events-none absolute -top-10 z-20 hidden rounded-md bg-slate-900 px-2 py-1 text-[11px] text-white shadow-md group-hover:flex flex-col whitespace-nowrap">
                <span className="font-semibold">{item.day}: {item.count} visitors</span>
                <span className="text-[10px] text-slate-400">Peak: {item.peak}</span>
              </div>

              {/* Bar */}
              <div
                style={{ height: `${height}%` }}
                className="w-full max-w-8 rounded-t-lg bg-emerald-500 transition-all duration-300 group-hover:bg-emerald-600 shadow-xs"
              />
              <span className="mt-2 text-[11px] font-semibold text-slate-600">{item.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
