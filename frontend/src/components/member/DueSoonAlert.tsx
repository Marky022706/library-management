import { AlertTriangle, ArrowRight, Clock } from 'lucide-react';
import { Button } from '../common/Button';

interface DueSoonAlertProps {
  bookTitle: string;
  daysRemaining: number;
  dueDate: string;
  onViewBook?: () => void;
}

export function DueSoonAlert({
  bookTitle,
  daysRemaining,
  dueDate,
  onViewBook,
}: DueSoonAlertProps) {
  if (daysRemaining < 0) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 sm:flex-row sm:items-center sm:justify-between text-rose-950">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-200/80 text-rose-800">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-rose-700">Overdue Notice</p>
            <p className="text-sm font-semibold mt-0.5">
              &ldquo;{bookTitle}&rdquo; was due on {dueDate} ({Math.abs(daysRemaining)} days overdue).
            </p>
            <p className="text-xs text-rose-800 mt-0.5">
              Please return this copy to the Balingasag Public Library circulation desk immediately to clear your account.
            </p>
          </div>
        </div>

        {onViewBook && (
          <Button
            size="sm"
            onClick={onViewBook}
            className="h-8 gap-1.5 self-start sm:self-center bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs shrink-0"
          >
            <span>View Loan</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 sm:flex-row sm:items-center sm:justify-between text-amber-950">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-200/80 text-amber-800">
          <Clock className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Due Soon Reminder</span>
            <span className="rounded-md bg-amber-200/60 px-2 py-0.5 text-[10px] font-bold text-amber-900">
              {daysRemaining === 0 ? 'Due Today' : `${daysRemaining} days remaining`}
            </span>
          </div>
          <p className="text-sm font-semibold mt-0.5">
            &ldquo;{bookTitle}&rdquo; is due on <span className="underline">{dueDate}</span>.
          </p>
          <p className="text-xs text-amber-800 mt-0.5">
            Please return or renew the book on or before the due date to avoid borrowing holds.
          </p>
        </div>
      </div>

      {onViewBook && (
        <Button
          size="sm"
          onClick={onViewBook}
          className="h-8 gap-1.5 self-start sm:self-center bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs shrink-0"
        >
          <span>View Loan Details</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
