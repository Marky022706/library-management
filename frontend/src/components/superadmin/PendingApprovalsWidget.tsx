import { UserCheck, Check, X, Eye, Clock } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import type { User } from '../../types';

interface PendingApprovalsWidgetProps {
  users: User[];
  onApprove: (user: User) => void;
  onReject?: (user: User) => void;
  onView: (user: User) => void;
}

export function PendingApprovalsWidget({
  users,
  onApprove,
  onReject,
  onView,
}: PendingApprovalsWidgetProps) {
  const pendingMembers = users.filter((u) => u.status === 'pending');

  if (pendingMembers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-8 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <UserCheck className="h-5 w-5" />
        </div>
        <p className="mt-2 text-xs font-semibold text-slate-800">All member applications reviewed</p>
        <p className="text-[11px] text-slate-500">No new registration approvals currently pending.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {pendingMembers.slice(0, 3).map((member) => (
        <div
          key={member.id}
          className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-xs font-bold text-slate-900">{member.name}</p>
              <Badge tone="amber" dot className="text-[10px]">
                PENDING
              </Badge>
            </div>
            <p className="truncate text-[11px] text-slate-500">{member.email}</p>
            <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
              <span>ID: {member.studentId || '2026-00123'}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {member.registeredAt || 'Today'}
              </span>
            </div>
          </div>

          {/* Inline Action Buttons */}
          <div className="flex items-center gap-1.5 self-end sm:self-center">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onView(member)}
              className="h-7 px-2.5 text-xs text-slate-600 hover:bg-slate-50"
            >
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
            <Button
              size="sm"
              onClick={() => onApprove(member)}
              className="h-7 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              <Check className="h-3 w-3 mr-1" />
              Approve
            </Button>
            {onReject && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onReject(member)}
                className="h-7 px-2 text-xs text-rose-600 hover:bg-rose-50 border-rose-200"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
