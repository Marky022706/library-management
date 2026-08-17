import { UserCheck, Archive, BookOpen, Edit3, Database, ShieldAlert } from 'lucide-react';
import { Badge } from '../common/Badge';

interface ActivityItem {
  id: string;
  user: string;
  role: 'Super Admin' | 'Admin' | 'Member' | 'System';
  action: string;
  target: string;
  timeAgo: string;
  type: 'approval' | 'archive' | 'borrow' | 'update' | 'backup' | 'security';
  status: 'Completed' | 'Pending' | 'Success';
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    user: 'Jose Reyes',
    role: 'Admin',
    action: 'approved a new Member account',
    target: 'Maria Santos (BSCS)',
    timeAgo: '2 minutes ago',
    type: 'approval',
    status: 'Completed',
  },
  {
    id: 'act-2',
    user: 'Elena Cruz',
    role: 'Super Admin',
    action: 'archived damaged copy of',
    target: 'Web Development Guide',
    timeAgo: '15 minutes ago',
    type: 'archive',
    status: 'Completed',
  },
  {
    id: 'act-3',
    user: 'Ana Gonzales',
    role: 'Member',
    action: 'submitted a borrowing request for',
    target: 'Clean Code (Robert C. Martin)',
    timeAgo: '25 minutes ago',
    type: 'borrow',
    status: 'Pending',
  },
  {
    id: 'act-4',
    user: 'Jose Reyes',
    role: 'Admin',
    action: 'updated shelf location and inventory for',
    target: 'Database Systems (10th Ed)',
    timeAgo: '42 minutes ago',
    type: 'update',
    status: 'Completed',
  },
  {
    id: 'act-5',
    user: 'System Cron',
    role: 'System',
    action: 'automated MySQL database backup completed',
    target: 'library_backup_20260816.sql.gz',
    timeAgo: '1 hour ago',
    type: 'backup',
    status: 'Success',
  },
];

const ICONS_BY_TYPE = {
  approval: { icon: UserCheck, bg: 'bg-emerald-50 text-emerald-600' },
  archive: { icon: Archive, bg: 'bg-amber-50 text-amber-600' },
  borrow: { icon: BookOpen, bg: 'bg-blue-50 text-blue-600' },
  update: { icon: Edit3, bg: 'bg-indigo-50 text-indigo-600' },
  backup: { icon: Database, bg: 'bg-purple-50 text-purple-600' },
  security: { icon: ShieldAlert, bg: 'bg-rose-50 text-rose-600' },
};

export function RecentActivityAudit() {
  return (
    <div className="flex flex-col gap-3">
      {ACTIVITIES.map((act) => {
        const itemConfig = ICONS_BY_TYPE[act.type] || ICONS_BY_TYPE.update;
        const Icon = itemConfig.icon;

        return (
          <div
            key={act.id}
            className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 transition-colors hover:bg-slate-100/60"
          >
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-2xs ${itemConfig.bg}`}>
              <Icon className="h-4 w-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="font-bold text-slate-900">{act.user}</span>
                <span className="text-[10px] font-semibold text-slate-400">({act.role})</span>
                <span className="text-slate-600">{act.action}</span>
                <span className="font-semibold text-emerald-800 truncate max-w-50">{act.target}</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">{act.timeAgo}</p>
            </div>

            <Badge
              tone={act.status === 'Completed' ? 'green' : act.status === 'Pending' ? 'amber' : 'purple'}
              className="text-[10px] shrink-0"
            >
              {act.status}
            </Badge>
          </div>
        );
      })}
    </div>
  );
}
