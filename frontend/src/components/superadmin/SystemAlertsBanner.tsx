import { AlertTriangle, UserCheck, CheckCircle2, ChevronRight } from 'lucide-react';

interface SystemAlertsBannerProps {
  onNavigateToUsers?: () => void;
  onNavigateToOverdue?: () => void;
  onNavigateToBackup?: () => void;
}

export function SystemAlertsBanner({
  onNavigateToUsers,
  onNavigateToOverdue,
  onNavigateToBackup,
}: SystemAlertsBannerProps) {
  return (
    <div className="flex flex-col gap-2.5">
      {/* Alert 1: Overdue books */}
      <div
        onClick={onNavigateToOverdue}
        className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50/70 p-3 text-xs font-medium text-rose-900 transition-colors hover:bg-rose-100/70"
      >
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
          <span><strong>12 overdue books</strong> require attention & follow-up notices.</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-700">
          <span>Review loans</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* Alert 2: Member approvals */}
      <div
        onClick={onNavigateToUsers}
        className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs font-medium text-amber-900 transition-colors hover:bg-amber-100/70"
      >
        <div className="flex items-center gap-2.5">
          <UserCheck className="h-4 w-4 text-amber-600 shrink-0" />
          <span><strong>8 member accounts</strong> are currently waiting for Administrator review & approval.</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-700">
          <span>Review applicants</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* Alert 3: Backup status */}
      <div
        onClick={onNavigateToBackup}
        className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs font-medium text-emerald-900 transition-colors hover:bg-emerald-100/70"
      >
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span><strong>System backup completed successfully</strong> today at 12:30 AM. MySQL database is intact.</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
          <span>View backups</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
}
