import { BookPlus, UserPlus, ClipboardList, BarChart3, Database, ScrollText } from 'lucide-react';

interface QuickActionsGridProps {
  onAddBook?: () => void;
  onCreateUser?: () => void;
  onReviewRequests?: () => void;
  onGenerateReport?: () => void;
  onBackupDatabase?: () => void;
  onViewAuditTrail?: () => void;
}

export function QuickActionsGrid({
  onAddBook,
  onCreateUser,
  onReviewRequests,
  onGenerateReport,
  onBackupDatabase,
  onViewAuditTrail,
}: QuickActionsGridProps) {
  const actions = [
    { label: 'Add New Book', icon: BookPlus, color: 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200/60', onClick: onAddBook },
    { label: 'Create Staff / User', icon: UserPlus, color: 'text-blue-700 bg-blue-50 hover:bg-blue-100/80 border-blue-200/60', onClick: onCreateUser },
    { label: 'Review Requests', icon: ClipboardList, color: 'text-amber-700 bg-amber-50 hover:bg-amber-100/80 border-amber-200/60', onClick: onReviewRequests },
    { label: 'Generate Reports', icon: BarChart3, color: 'text-purple-700 bg-purple-50 hover:bg-purple-100/80 border-purple-200/60', onClick: onGenerateReport },
    { label: 'Backup Database', icon: Database, color: 'text-slate-700 bg-slate-50 hover:bg-slate-100/80 border-slate-200/60', onClick: onBackupDatabase },
    { label: 'View Audit Trail', icon: ScrollText, color: 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 border-indigo-200/60', onClick: onViewAuditTrail },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {actions.map((act, idx) => {
        const Icon = act.icon;
        return (
          <button
            key={idx}
            onClick={act.onClick}
            className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition-all duration-200 shadow-2xs hover:shadow-sm hover:-translate-y-0.5 ${act.color}`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-xs">
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold">{act.label}</span>
          </button>
        );
      })}
    </div>
  );
}
