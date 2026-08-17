import { BookOpen, Bookmark, CheckCircle2, UserCheck, CalendarCheck } from 'lucide-react';

interface ActivityRecord {
  id: string;
  action: string;
  target: string;
  timeAgo: string;
  type: 'borrow' | 'reserve' | 'return' | 'profile' | 'attendance';
}

const ACTIVITIES: ActivityRecord[] = [
  {
    id: 'a-1',
    action: 'Borrowed book copy of',
    target: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    timeAgo: 'Today, 10:30 AM',
    type: 'borrow',
  },
  {
    id: 'a-2',
    action: 'Placed active reservation on',
    target: 'Database System Concepts (7th Ed)',
    timeAgo: 'Yesterday, 2:15 PM',
    type: 'reserve',
  },
  {
    id: 'a-3',
    action: 'Returned borrowed copy of',
    target: 'Python Basics: A Practical Introduction',
    timeAgo: 'Aug 14, 2026',
    type: 'return',
  },
  {
    id: 'a-4',
    action: 'Checked into library kiosk for study session',
    target: 'Main Reading Hall (Seat #14)',
    timeAgo: 'Aug 13, 2026',
    type: 'attendance',
  },
  {
    id: 'a-5',
    action: 'Updated contact number and address in',
    target: 'Member Profile Settings',
    timeAgo: 'Aug 12, 2026',
    type: 'profile',
  },
];

const ICONS = {
  borrow: { icon: BookOpen, color: 'text-emerald-700 bg-emerald-50' },
  reserve: { icon: Bookmark, color: 'text-blue-700 bg-blue-50' },
  return: { icon: CheckCircle2, color: 'text-purple-700 bg-purple-50' },
  attendance: { icon: CalendarCheck, color: 'text-indigo-700 bg-indigo-50' },
  profile: { icon: UserCheck, color: 'text-slate-700 bg-slate-100' },
};

export function MemberRecentActivity() {
  return (
    <div className="flex flex-col gap-3">
      {ACTIVITIES.map((act) => {
        const itemConfig = ICONS[act.type] || ICONS.borrow;
        const Icon = itemConfig.icon;

        return (
          <div
            key={act.id}
            className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 transition-colors hover:bg-slate-100/70"
          >
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-2xs ${itemConfig.color}`}>
              <Icon className="h-4 w-4" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-700">
                <span className="text-slate-500">{act.action}</span>{' '}
                <span className="font-bold text-slate-900">{act.target}</span>
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">{act.timeAgo}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
