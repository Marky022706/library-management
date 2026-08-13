import { useMemo, useState } from 'react';
import { QrCode } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { AttendanceStats } from '../../components/attendance/AttendanceStats';
import { CurrentlyInsidePanel } from '../../components/attendance/CurrentlyInsidePanel';
import { AttendanceTable } from '../../components/attendance/AttendanceTable';
import { QRScanModal } from '../../components/attendance/QRScanModal';
import { useLibraryData } from '../../context/LibraryDataContext';
import { useToast } from '../../context/ToastContext';
import { formatLongDate, MOCK_TODAY } from '../../utils/date';
import { userDisplayName } from '../../data/users';

export function Attendance() {
  const { users, attendanceRecords, currentlyInside, avgVisitMinutes, stats, checkIn, checkOut } = useLibraryData();
  const { showToast } = useToast();
  const [scanOpen, setScanOpen] = useState(false);

  const members = useMemo(() => users.filter((u) => u.role === 'member' && u.status === 'active'), [users]);
  const insideMemberIds = useMemo(() => new Set(currentlyInside.map((r) => r.memberId)), [currentlyInside]);

  const todaysLog = useMemo(
    () => attendanceRecords.filter((r) => r.date === MOCK_TODAY).sort((a, b) => (a.timeIn < b.timeIn ? 1 : -1)),
    [attendanceRecords],
  );

  const handleCheckIn = (memberId: string) => {
    checkIn(memberId);
    showToast(`${userDisplayName(memberId)} checked in successfully.`);
    setScanOpen(false);
  };

  const handleCheckOut = (memberId: string) => {
    checkOut(memberId);
    showToast(`${userDisplayName(memberId)} checked out successfully.`);
    setScanOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink">Attendance</h1>
        <Button icon={<QrCode className="h-4 w-4" aria-hidden="true" />} onClick={() => setScanOpen(true)}>
          Simulate QR Scan
        </Button>
      </div>

      <AttendanceStats
        todaysAttendance={stats.todaysVisitors}
        currentlyInsideCount={currentlyInside.length}
        totalVisitors={attendanceRecords.length}
        avgVisitMinutes={avgVisitMinutes}
      />

      <CurrentlyInsidePanel records={currentlyInside} />

      <Card title={`Today's Attendance Log — ${formatLongDate(MOCK_TODAY)}`}>
        <AttendanceTable records={todaysLog} />
      </Card>

      <QRScanModal
        open={scanOpen}
        onClose={() => setScanOpen(false)}
        members={members}
        insideMemberIds={insideMemberIds}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
      />
    </div>
  );
}
