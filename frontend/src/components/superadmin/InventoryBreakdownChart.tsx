import { BookOpen, CheckCircle, Clock, AlertOctagon, HelpCircle, Wrench, Archive } from 'lucide-react';
import type { Book } from '../../types';

interface InventoryBreakdownChartProps {
  books?: Book[];
  onManageBooks?: () => void;
}

export function InventoryBreakdownChart({ books: _books, onManageBooks }: InventoryBreakdownChartProps) {
  // Inventory segments based on SRS
  const total = 2450;
  const available = 1820;
  const borrowed = 540;
  const damaged = 45;
  const lost = 20;
  const maintenance = 15;
  const archived = 10;

  const items = [
    { label: 'Available', count: available, percent: Math.round((available / total) * 100), color: 'bg-emerald-500', text: 'text-emerald-700', icon: CheckCircle },
    { label: 'Borrowed', count: borrowed, percent: Math.round((borrowed / total) * 100), color: 'bg-blue-500', text: 'text-blue-700', icon: Clock },
    { label: 'Damaged', count: damaged, percent: 2, color: 'bg-amber-500', text: 'text-amber-700', icon: AlertOctagon },
    { label: 'Lost', count: lost, percent: 1, color: 'bg-rose-500', text: 'text-rose-700', icon: HelpCircle },
    { label: 'Maintenance', count: maintenance, percent: 1, color: 'bg-indigo-500', text: 'text-indigo-700', icon: Wrench },
    { label: 'Archived', count: archived, percent: 1, color: 'bg-slate-400', text: 'text-slate-700', icon: Archive },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Segmented Progress Bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span>Catalog Health & Circulation</span>
          <span>{total.toLocaleString()} Total Books</span>
        </div>
        <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 shadow-inner">
          {items.map((item, idx) => (
            <div
              key={idx}
              style={{ width: `${item.percent}%` }}
              className={`h-full ${item.color} first:rounded-l-full last:rounded-r-full transition-all`}
              title={`${item.label}: ${item.count} (${item.percent}%)`}
            />
          ))}
        </div>
      </div>

      {/* Grid list of categories & counts */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-2.5">
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white shadow-xs ${item.text}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-slate-500">{item.label}</p>
                <p className="text-sm font-bold text-slate-900">{item.count.toLocaleString()}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Access Action */}
      {onManageBooks && (
        <button
          onClick={onManageBooks}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-600/30 bg-emerald-50/50 py-2.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100/70 transition-colors"
        >
          <BookOpen className="h-4 w-4 text-emerald-700" />
          Manage Books & Catalog Inventory
        </button>
      )}
    </div>
  );
}
