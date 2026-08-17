import { ArrowRight, BookOpen } from 'lucide-react';
import { Badge } from '../common/Badge';

interface BookActivity {
  id: string;
  book: string;
  action: 'Added' | 'Updated' | 'Archived' | 'Restored';
  user: string;
  role: string;
  date: string;
  status: 'Completed' | 'Pending';
}

const SAMPLE_BOOK_ACTIVITIES: BookActivity[] = [
  {
    id: 'bk-act-1',
    book: 'Introduction to Python & Data Science',
    action: 'Added',
    user: 'Jose Reyes',
    role: 'Admin',
    date: 'Today, 10:15 AM',
    status: 'Completed',
  },
  {
    id: 'bk-act-2',
    book: 'Database System Concepts (7th Ed)',
    action: 'Updated',
    user: 'Jose Reyes',
    role: 'Admin',
    date: 'Today, 09:30 AM',
    status: 'Completed',
  },
  {
    id: 'bk-act-3',
    book: 'Web Development with Node & React',
    action: 'Archived',
    user: 'Elena Cruz',
    role: 'Super Admin',
    date: 'Yesterday',
    status: 'Completed',
  },
  {
    id: 'bk-act-4',
    book: 'Clean Architecture: A Craftsman’s Guide',
    action: 'Added',
    user: 'Elena Cruz',
    role: 'Super Admin',
    date: 'Aug 14, 2026',
    status: 'Completed',
  },
];

const ACTION_TONE = {
  Added: 'green' as const,
  Updated: 'blue' as const,
  Archived: 'amber' as const,
  Restored: 'purple' as const,
};

interface RecentBookActivityTableProps {
  onViewAllBooks?: () => void;
}

export function RecentBookActivityTable({ onViewAllBooks }: RecentBookActivityTableProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto">
        <table className="w-full min-w-120 text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              <th className="py-2.5 pr-4">Book Title</th>
              <th className="py-2.5 pr-4">Action</th>
              <th className="py-2.5 pr-4">Initiated By</th>
              <th className="py-2.5 pr-4">Date</th>
              <th className="py-2.5 pr-0 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {SAMPLE_BOOK_ACTIVITIES.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-slate-50/80">
                <td className="py-3 pr-4 font-semibold text-slate-800 flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate max-w-55">{item.book}</span>
                </td>
                <td className="py-3 pr-4">
                  <Badge tone={ACTION_TONE[item.action]}>{item.action}</Badge>
                </td>
                <td className="py-3 pr-4 text-slate-600">
                  <span className="font-medium">{item.user}</span>
                  <span className="text-[10px] text-slate-400 ml-1">({item.role})</span>
                </td>
                <td className="py-3 pr-4 text-slate-500">{item.date}</td>
                <td className="py-3 pr-0 text-right">
                  <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {onViewAllBooks && (
        <button
          onClick={onViewAllBooks}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors shadow-2xs"
        >
          <span>View Complete Book Catalog & History</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
