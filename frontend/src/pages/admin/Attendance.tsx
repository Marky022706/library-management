import { useMemo, useState } from 'react';
import { QrCode, Users, DoorOpen, Clock, CalendarCheck } from 'lucide-react';
import type { AttendanceRecord, AttendanceStatus, User } from '@/types';
import { fullName } from '@/types';
import { Button, Select, Badge, Card, DataTable, Pagination, type DataTableColumn } from '@/components/ui';
import { useLibrary } from '@/hooks/useLibrary';
import { useToast } from '@/hooks/useToast';
import { usePagination } from '@/hooks/usePagination';
import { formatDate, formatTime } from '@/utils/date';

const PURPOSE_OPTIONS = [
  { label: 'Reading & Research', value: 'Reading & Research' },
  { label: 'Study', value: 'Study' },
  { label: 'Internet Access', value: 'Internet Access' },
  { label: 'Borrow Book', value: 'Borrow Book' },
  { label: 'Return Book', value: 'Return Book' },
];

const STATUS_VARIANT: Record<AttendanceStatus, 'warning' | 'neutral'> = {
  inside: 'warning',
  completed: 'neutral',
};

function isToday(value: string): boolean {
  const date = new Date(value);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function pickEligibleMember(users: User[], attendance: AttendanceRecord[]): User | null {
  const insideIds = new Set(attendance.filter((a) => a.status === 'inside').map((a) => a.userId));
  const eligible = users.filter((u) => u.role === 'member' && u.status === 'active' && !insideIds.has(u.id));
  if (eligible.length === 0) return null;
  return eligible[Math.floor(Math.random() * eligible.length)];
}

export function Attendance() {
  const lib = useLibrary();
  const toast = useToast();

  const [purpose, setPurpose] = useState(PURPOSE_OPTIONS[0].value);
  const [isScanning, setIsScanning] = useState(false);
  const [timingOutId, setTimingOutId] = useState<string | null>(null);

  const sortedAttendance = useMemo(
    () => lib.attendance.slice().sort((a, b) => new Date(b.timeIn).getTime() - new Date(a.timeIn).getTime()),
    [lib.attendance],
  );

  const { page, totalPages, pageItems, setPage } = usePagination(sortedAttendance, 10);

  const stats = useMemo(() => {
    const todays = lib.attendance.filter((a) => isToday(a.date));
    const uniqueVisitors = new Set(lib.attendance.map((a) => a.userId)).size;
    const currentlyInside = lib.attendance.filter((a) => a.status === 'inside').length;
    const completed = lib.attendance.filter((a) => a.status === 'completed' && a.timeOut);
    const avgMinutes = completed.length
      ? Math.round(
          completed.reduce((sum, a) => sum + (new Date(a.timeOut!).getTime() - new Date(a.timeIn).getTime()) / 60000, 0) /
            completed.length,
        )
      : 0;
    return { todaysCount: todays.length, uniqueVisitors, currentlyInside, avgMinutes };
  }, [lib.attendance]);

  async function handleSimulateScan() {
    const member = pickEligibleMember(lib.users, lib.attendance);
    if (!member) {
      toast.info('No eligible members available to simulate a scan right now.');
      return;
    }
    setIsScanning(true);
    try {
      await lib.simulateTimeIn(member.id, purpose);
      toast.success(`${fullName(member)} checked in via simulated QR scan.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to simulate scan. Please try again.');
    } finally {
      setIsScanning(false);
    }
  }

  async function handleTimeOut(record: AttendanceRecord) {
    setTimingOutId(record.id);
    try {
      await lib.simulateTimeOut(record.id);
      toast.success('Time out recorded.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to record time out. Please try again.');
    } finally {
      setTimingOutId(null);
    }
  }

  const columns: DataTableColumn<AttendanceRecord>[] = [
    {
      key: 'member',
      header: 'Member',
      render: (record) => {
        const user = lib.getUserById(record.userId);
        return (
          <div>
            <p className="font-medium text-gray-900">{user ? fullName(user) : 'Unknown member'}</p>
            {record.purpose && <p className="text-xs text-gray-500">{record.purpose}</p>}
          </div>
        );
      },
    },
    { key: 'date', header: 'Date', render: (record) => formatDate(record.date) },
    { key: 'timeIn', header: 'Time In', render: (record) => formatTime(record.timeIn) },
    { key: 'timeOut', header: 'Time Out', render: (record) => (record.timeOut ? formatTime(record.timeOut) : '—') },
    {
      key: 'status',
      header: 'Status',
      render: (record) => (
        <Badge variant={STATUS_VARIANT[record.status]} dot className="capitalize">
          {record.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      headerClassName: 'text-right',
      render: (record) =>
        record.status === 'inside' ? (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              isLoading={timingOutId === record.id}
              onClick={() => handleTimeOut(record)}
            >
              Time Out
            </Button>
          </div>
        ) : (
          <span className="block text-right text-gray-300">—</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Attendance</h1>
          <p className="mt-1 text-sm text-gray-500">Track visitor attendance via simulated QR scans.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select
            options={PURPOSE_OPTIONS}
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            containerClassName="sm:w-52"
            aria-label="Visit purpose"
          />
          <Button leftIcon={<QrCode className="h-4 w-4" />} isLoading={isScanning} onClick={handleSimulateScan}>
            Simulate QR Scan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
            <CalendarCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Today's Attendance</p>
            <p className="text-xl font-semibold text-gray-900">{stats.todaysCount}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Total Visitors</p>
            <p className="text-xl font-semibold text-gray-900">{stats.uniqueVisitors}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <DoorOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Currently Inside</p>
            <p className="text-xl font-semibold text-gray-900">{stats.currentlyInside}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Average Visit</p>
            <p className="text-xl font-semibold text-gray-900">{stats.avgMinutes} min</p>
          </div>
        </Card>
      </div>

      <Card>
        <DataTable
          columns={columns}
          data={pageItems}
          keyField={(record) => record.id}
          emptyTitle="No attendance records"
          emptyDescription="No visitors have been recorded yet."
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-4" />
      </Card>
    </div>
  );
}
