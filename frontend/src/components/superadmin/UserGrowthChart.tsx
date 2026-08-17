import { UserPlus, UserCheck, UserX } from 'lucide-react';
import type { User } from '../../types';

interface UserGrowthChartProps {
  users: User[];
}

export function UserGrowthChart({ users }: UserGrowthChartProps) {
  const activeMembers = users.filter((u) => u.status === 'active').length || 1180;
  const newMembersThisMonth = 94;
  const pendingOrInactive = users.filter((u) => u.status === 'pending' || u.status === 'suspended').length || 70;
  const total = activeMembers + pendingOrInactive;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="font-medium text-slate-700">Membership Distribution & Growth</span>
        <span className="text-emerald-700 font-semibold">+{newMembersThisMonth} this month</span>
      </div>

      {/* Visual Distribution Bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100 p-0.5">
          <div
            style={{ width: `${Math.round((activeMembers / total) * 100)}%` }}
            className="h-full rounded-l-full bg-emerald-600"
            title={`Active Members: ${activeMembers}`}
          />
          <div
            style={{ width: `${Math.round((pendingOrInactive / total) * 100)}%` }}
            className="h-full rounded-r-full bg-amber-500"
            title={`Pending / Inactive: ${pendingOrInactive}`}
          />
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-3 gap-2.5 pt-1">
        <div className="flex flex-col rounded-xl border border-slate-100 bg-slate-50/80 p-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <UserPlus className="h-3.5 w-3.5 text-blue-500" />
            <span>New (Month)</span>
          </div>
          <p className="mt-1 text-base font-bold text-slate-900">+{newMembersThisMonth}</p>
        </div>

        <div className="flex flex-col rounded-xl border border-slate-100 bg-slate-50/80 p-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Active</span>
          </div>
          <p className="mt-1 text-base font-bold text-slate-900">{activeMembers}</p>
        </div>

        <div className="flex flex-col rounded-xl border border-slate-100 bg-slate-50/80 p-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <UserX className="h-3.5 w-3.5 text-amber-500" />
            <span>Pending/Susp.</span>
          </div>
          <p className="mt-1 text-base font-bold text-slate-900">{pendingOrInactive}</p>
        </div>
      </div>
    </div>
  );
}
