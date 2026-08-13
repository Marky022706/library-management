import type { AttendanceRecord } from '../../types';
import { userDisplayName } from '../../data/users';

interface CurrentlyInsidePanelProps {
  records: AttendanceRecord[];
}

export function CurrentlyInsidePanel({ records }: CurrentlyInsidePanelProps) {
  return (
    <div className="rounded-2xl border border-primary-200 bg-primary-50 p-5">
      <p className="mb-3 text-sm font-semibold text-primary-800">Currently Inside ({records.length})</p>
      {records.length === 0 ? (
        <p className="text-sm text-primary-700">No one is currently inside the library.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {records.map((record) => (
            <span key={record.id} className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm shadow-sm">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-800" aria-hidden="true">
                {userDisplayName(record.memberId).charAt(0).toUpperCase()}
              </span>
              <span className="font-medium text-ink">{userDisplayName(record.memberId)}</span>
              <span className="text-muted">since {record.timeIn}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
