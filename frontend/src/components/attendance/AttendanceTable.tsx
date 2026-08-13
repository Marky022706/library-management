import { CalendarClock } from 'lucide-react';
import type { AttendanceRecord } from '../../types';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { userDisplayName } from '../../data/users';

interface AttendanceTableProps {
  records: AttendanceRecord[];
}

export function AttendanceTable({ records }: AttendanceTableProps) {
  if (records.length === 0) {
    return <EmptyState icon={CalendarClock} title="No attendance recorded" description="Check-ins will show up here." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-line text-xs font-semibold uppercase tracking-wide text-muted">
            <th className="py-3 pr-4">Member</th>
            <th className="py-3 pr-4">Date</th>
            <th className="py-3 pr-4">Time In</th>
            <th className="py-3 pr-4">Time Out</th>
            <th className="py-3 pr-0">Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className="border-b border-line last:border-0 hover:bg-gray-50/60">
              <td className="py-3 pr-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-800" aria-hidden="true">
                    {userDisplayName(record.memberId).charAt(0).toUpperCase()}
                  </span>
                  <span className="font-medium text-ink">{userDisplayName(record.memberId)}</span>
                </div>
              </td>
              <td className="py-3 pr-4 text-muted">{record.date}</td>
              <td className="py-3 pr-4 text-muted">{record.timeIn}</td>
              <td className="py-3 pr-4 text-muted">{record.timeOut ?? '—'}</td>
              <td className="py-3 pr-0">
                <Badge tone={record.status === 'inside' ? 'blue' : 'neutral'} dot>
                  {record.status === 'inside' ? 'Inside' : 'Left'}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
