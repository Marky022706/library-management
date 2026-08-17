import { BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export interface MemberLoanItem {
  id: string;
  bookId: string;
  title: string;
  author: string;
  borrowDate: string;
  dueDate: string;
  daysRemaining: number;
  totalDays: number;
  status: 'active' | 'due_soon' | 'overdue';
  coverColor?: string;
}

interface MyBooksSummaryProps {
  loans: MemberLoanItem[];
  onViewDetails: (loan: MemberLoanItem) => void;
  onViewAll?: () => void;
}

export function MyBooksSummary({ loans, onViewDetails, onViewAll }: MyBooksSummaryProps) {
  if (loans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <BookOpen className="h-6 w-6" />
        </div>
        <p className="mt-3 text-sm font-semibold text-slate-800">No active book loans</p>
        <p className="text-xs text-slate-500 max-w-xs mt-0.5">
          Browse the public library catalog and submit a borrow request to check out books.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3.5">
        {loans.map((loan) => {
          const progressPercent = Math.min(100, Math.max(0, ((loan.totalDays - loan.daysRemaining) / loan.totalDays) * 100));
          const isOverdue = loan.daysRemaining < 0;
          const isDueSoon = loan.daysRemaining <= 3 && !isOverdue;

          return (
            <div
              key={loan.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-all hover:border-emerald-200 hover:shadow-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  {/* Book thumbnail */}
                  <div
                    style={{ backgroundColor: loan.coverColor || '#16a34a' }}
                    className="flex h-12 w-9 shrink-0 items-center justify-center rounded-md text-white shadow-xs"
                  >
                    <BookOpen className="h-4 w-4 opacity-80" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-slate-900">{loan.title}</h3>
                    <p className="truncate text-xs text-slate-500">{loan.author}</p>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Due {loan.dueDate}
                      </span>
                    </div>
                  </div>
                </div>

                <Badge
                  tone={isOverdue ? 'red' : isDueSoon ? 'amber' : 'green'}
                  className="shrink-0 text-[10px]"
                >
                  {isOverdue ? 'OVERDUE' : isDueSoon ? 'DUE SOON' : 'ACTIVE'}
                </Badge>
              </div>

              {/* Progress Bar & Remaining Days */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px] font-medium">
                  <span className="text-slate-500">Loan Period</span>
                  <span className={isOverdue ? 'text-rose-600 font-bold' : isDueSoon ? 'text-amber-700 font-bold' : 'text-emerald-700'}>
                    {isOverdue ? `${Math.abs(loan.daysRemaining)} days overdue` : `${loan.daysRemaining} days remaining`}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    style={{ width: `${progressPercent}%` }}
                    className={`h-full rounded-full transition-all ${
                      isOverdue ? 'bg-rose-500' : isDueSoon ? 'bg-amber-500' : 'bg-emerald-600'
                    }`}
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewDetails(loan)}
                  className="h-7 text-xs text-slate-700 hover:bg-slate-50"
                >
                  View Loan Details
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {onViewAll && (
        <button
          onClick={onViewAll}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors shadow-2xs"
        >
          <span>View All My Books & Circulation History</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
