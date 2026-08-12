import { useState, type ReactNode } from 'react';
import { FileDown, FileSpreadsheet } from 'lucide-react';
import type {
  AttendanceStatus,
  BookCondition,
  BorrowingStatus,
  LogLevel,
  ReportCategory,
  RequestStatus,
  RequestType,
} from '@/types';
import { fullName } from '@/types';
import {
  Button,
  Input,
  Select,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  DataTable,
  type DataTableColumn,
} from '@/components/ui';
import { useLibrary } from '@/hooks/useLibrary';
import { useToast } from '@/hooks/useToast';
import { formatDate, formatDateTime, formatTime, daysBetween } from '@/utils/date';

const CATEGORY_OPTIONS: { label: string; value: ReportCategory }[] = [
  { label: 'Borrowing', value: 'Borrowing' },
  { label: 'Attendance', value: 'Attendance' },
  { label: 'Inventory', value: 'Inventory' },
  { label: 'Overdue', value: 'Overdue' },
  { label: 'Book Conditions', value: 'Book Conditions' },
  { label: 'Requests', value: 'Requests' },
  { label: 'Member Activities', value: 'Member Activities' },
  { label: 'Login History', value: 'Login History' },
  { label: 'Audit Logs', value: 'Audit Logs' },
  { label: 'System Activity', value: 'System Activity' },
];

const BORROWING_STATUS_VARIANT: Record<BorrowingStatus, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  pending: 'warning',
  active: 'info',
  returned: 'success',
  overdue: 'danger',
  rejected: 'neutral',
};

const REQUEST_STATUS_VARIANT: Record<RequestStatus, 'warning' | 'success' | 'danger'> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
};

const REQUEST_TYPE_VARIANT: Record<RequestType, 'info' | 'neutral' | 'primary'> = {
  Borrowing: 'info',
  Archive: 'neutral',
  Acquisition: 'primary',
};

const ATTENDANCE_STATUS_VARIANT: Record<AttendanceStatus, 'warning' | 'neutral'> = {
  inside: 'warning',
  completed: 'neutral',
};

const CONDITION_VARIANT: Record<BookCondition, 'success' | 'info' | 'warning' | 'danger'> = {
  New: 'success',
  Good: 'info',
  Fair: 'warning',
  Worn: 'warning',
  Damaged: 'danger',
};

const LOG_LEVEL_VARIANT: Record<LogLevel, 'info' | 'warning' | 'danger'> = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'danger',
};

type ReportRow = Record<string, ReactNode>;

interface ReportResult {
  columns: DataTableColumn<ReportRow>[];
  rows: ReportRow[];
  stats: { label: string; value: string }[];
  scopeNote?: string;
}

function inRange(iso: string, start: string, end: string): boolean {
  const t = new Date(iso).getTime();
  const startT = new Date(`${start}T00:00:00`).getTime();
  const endT = new Date(`${end}T23:59:59.999`).getTime();
  return t >= startT && t <= endT;
}

function toInputDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function defaultStartDate(): string {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return toInputDate(date);
}

function buildReport(category: ReportCategory, startDate: string, endDate: string, lib: ReturnType<typeof useLibrary>): ReportResult {
  switch (category) {
    case 'Borrowing': {
      const matches = lib.borrowings.filter((b) => inRange(b.requestedDate, startDate, endDate));
      const sorted = matches.slice().sort((a, b) => new Date(b.requestedDate).getTime() - new Date(a.requestedDate).getTime());
      const rows: ReportRow[] = sorted.map((b) => {
        const book = lib.getBookById(b.bookId);
        const user = lib.getUserById(b.userId);
        return {
          id: b.id,
          borrower: user ? fullName(user) : 'Unknown',
          book: book?.title ?? 'Unknown',
          requested: formatDate(b.requestedDate),
          due: formatDate(b.dueDate),
          status: (
            <Badge variant={BORROWING_STATUS_VARIANT[b.status]} className="capitalize">
              {b.status}
            </Badge>
          ),
        };
      });
      const columns: DataTableColumn<ReportRow>[] = [
        { key: 'id', header: 'ID', render: (r) => r.id },
        { key: 'borrower', header: 'Borrower', render: (r) => r.borrower },
        { key: 'book', header: 'Book', render: (r) => r.book },
        { key: 'requested', header: 'Requested', render: (r) => r.requested },
        { key: 'due', header: 'Due', render: (r) => r.due },
        { key: 'status', header: 'Status', render: (r) => r.status },
      ];
      return {
        columns,
        rows,
        stats: [
          { label: 'Total Requests', value: String(matches.length) },
          { label: 'Active', value: String(matches.filter((b) => b.status === 'active').length) },
          { label: 'Returned', value: String(matches.filter((b) => b.status === 'returned').length) },
          { label: 'Overdue', value: String(matches.filter((b) => b.status === 'overdue').length) },
          { label: 'Pending', value: String(matches.filter((b) => b.status === 'pending').length) },
        ],
      };
    }
    case 'Overdue': {
      const matches = lib.borrowings.filter((b) => b.status === 'overdue' && inRange(b.dueDate, startDate, endDate));
      const rows: ReportRow[] = matches.map((b) => {
        const book = lib.getBookById(b.bookId);
        const user = lib.getUserById(b.userId);
        return {
          id: b.id,
          borrower: user ? fullName(user) : 'Unknown',
          book: book?.title ?? 'Unknown',
          due: formatDate(b.dueDate),
          daysOverdue: String(Math.max(0, daysBetween(b.dueDate, new Date()))),
        };
      });
      const columns: DataTableColumn<ReportRow>[] = [
        { key: 'id', header: 'ID', render: (r) => r.id },
        { key: 'borrower', header: 'Borrower', render: (r) => r.borrower },
        { key: 'book', header: 'Book', render: (r) => r.book },
        { key: 'due', header: 'Due Date', render: (r) => r.due },
        { key: 'daysOverdue', header: 'Days Overdue', render: (r) => r.daysOverdue },
      ];
      const avgDays = matches.length
        ? Math.round(matches.reduce((sum, b) => sum + Math.max(0, daysBetween(b.dueDate, new Date())), 0) / matches.length)
        : 0;
      return {
        columns,
        rows,
        stats: [
          { label: 'Total Overdue', value: String(matches.length) },
          { label: 'Avg Days Overdue', value: String(avgDays) },
        ],
        scopeNote: 'Filtered by due date within the selected range.',
      };
    }
    case 'Attendance': {
      const matches = lib.attendance.filter((a) => inRange(a.date, startDate, endDate));
      const sorted = matches.slice().sort((a, b) => new Date(b.timeIn).getTime() - new Date(a.timeIn).getTime());
      const rows: ReportRow[] = sorted.map((a) => {
        const user = lib.getUserById(a.userId);
        return {
          id: a.id,
          member: user ? fullName(user) : 'Unknown',
          date: formatDate(a.date),
          timeIn: formatTime(a.timeIn),
          timeOut: a.timeOut ? formatTime(a.timeOut) : '—',
          status: (
            <Badge variant={ATTENDANCE_STATUS_VARIANT[a.status]} className="capitalize">
              {a.status}
            </Badge>
          ),
        };
      });
      const columns: DataTableColumn<ReportRow>[] = [
        { key: 'member', header: 'Member', render: (r) => r.member },
        { key: 'date', header: 'Date', render: (r) => r.date },
        { key: 'timeIn', header: 'Time In', render: (r) => r.timeIn },
        { key: 'timeOut', header: 'Time Out', render: (r) => r.timeOut },
        { key: 'status', header: 'Status', render: (r) => r.status },
      ];
      const completed = matches.filter((a) => a.status === 'completed' && a.timeOut);
      const avgMinutes = completed.length
        ? Math.round(
            completed.reduce((sum, a) => sum + (new Date(a.timeOut!).getTime() - new Date(a.timeIn).getTime()) / 60000, 0) /
              completed.length,
          )
        : 0;
      return {
        columns,
        rows,
        stats: [
          { label: 'Total Visits', value: String(matches.length) },
          { label: 'Unique Visitors', value: String(new Set(matches.map((a) => a.userId)).size) },
          { label: 'Currently Inside', value: String(matches.filter((a) => a.status === 'inside').length) },
          { label: 'Avg Visit (min)', value: String(avgMinutes) },
        ],
      };
    }
    case 'Inventory': {
      const activeBooks = lib.books.filter((b) => b.status === 'active');
      const archivedCount = lib.books.filter((b) => b.status === 'archived').length;
      const byCategory = new Map<string, { titles: number; quantity: number; available: number }>();
      activeBooks.forEach((b) => {
        const entry = byCategory.get(b.category) ?? { titles: 0, quantity: 0, available: 0 };
        entry.titles += 1;
        entry.quantity += b.quantity;
        entry.available += b.available;
        byCategory.set(b.category, entry);
      });
      const rows: ReportRow[] = Array.from(byCategory.entries())
        .sort((a, b) => b[1].titles - a[1].titles)
        .map(([category, entry]) => ({
          id: category,
          category,
          titles: String(entry.titles),
          quantity: String(entry.quantity),
          available: String(entry.available),
        }));
      const columns: DataTableColumn<ReportRow>[] = [
        { key: 'category', header: 'Category', render: (r) => r.category },
        { key: 'titles', header: 'Titles', render: (r) => r.titles },
        { key: 'quantity', header: 'Total Copies', render: (r) => r.quantity },
        { key: 'available', header: 'Available Copies', render: (r) => r.available },
      ];
      return {
        columns,
        rows,
        stats: [
          { label: 'Active Titles', value: String(activeBooks.length) },
          { label: 'Archived Titles', value: String(archivedCount) },
          { label: 'Total Copies', value: String(activeBooks.reduce((sum, b) => sum + b.quantity, 0)) },
          { label: 'Available Copies', value: String(activeBooks.reduce((sum, b) => sum + b.available, 0)) },
        ],
        scopeNote: 'Snapshot of the current catalog — not filtered by the date range.',
      };
    }
    case 'Book Conditions': {
      const activeBooks = lib.books.filter((b) => b.status === 'active');
      const conditions: BookCondition[] = ['New', 'Good', 'Fair', 'Worn', 'Damaged'];
      const rows: ReportRow[] = conditions.map((condition) => {
        const matches = activeBooks.filter((b) => b.condition === condition);
        return {
          id: condition,
          condition: <Badge variant={CONDITION_VARIANT[condition]}>{condition}</Badge>,
          titles: String(matches.length),
          copies: String(matches.reduce((sum, b) => sum + b.quantity, 0)),
        };
      });
      const columns: DataTableColumn<ReportRow>[] = [
        { key: 'condition', header: 'Condition', render: (r) => r.condition },
        { key: 'titles', header: 'Titles', render: (r) => r.titles },
        { key: 'copies', header: 'Total Copies', render: (r) => r.copies },
      ];
      const needsAttention = activeBooks.filter((b) => b.condition === 'Worn' || b.condition === 'Damaged').length;
      return {
        columns,
        rows,
        stats: [
          { label: 'Total Active Titles', value: String(activeBooks.length) },
          { label: 'Needs Attention', value: String(needsAttention) },
        ],
        scopeNote: 'Snapshot of the current catalog — not filtered by the date range.',
      };
    }
    case 'Requests': {
      const matches = lib.requests.filter((r) => inRange(r.date, startDate, endDate));
      const sorted = matches.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const rows: ReportRow[] = sorted.map((r) => {
        const requester = lib.getUserById(r.requesterId);
        return {
          id: r.id,
          type: <Badge variant={REQUEST_TYPE_VARIANT[r.type]}>{r.type}</Badge>,
          requester: requester ? fullName(requester) : 'Unknown',
          status: (
            <Badge variant={REQUEST_STATUS_VARIANT[r.status]} className="capitalize">
              {r.status}
            </Badge>
          ),
          date: formatDate(r.date),
        };
      });
      const columns: DataTableColumn<ReportRow>[] = [
        { key: 'id', header: 'Request ID', render: (r) => r.id },
        { key: 'type', header: 'Type', render: (r) => r.type },
        { key: 'requester', header: 'Requester', render: (r) => r.requester },
        { key: 'status', header: 'Status', render: (r) => r.status },
        { key: 'date', header: 'Date', render: (r) => r.date },
      ];
      return {
        columns,
        rows,
        stats: [
          { label: 'Total Requests', value: String(matches.length) },
          { label: 'Pending', value: String(matches.filter((r) => r.status === 'pending').length) },
          { label: 'Approved', value: String(matches.filter((r) => r.status === 'approved').length) },
          { label: 'Rejected', value: String(matches.filter((r) => r.status === 'rejected').length) },
        ],
      };
    }
    case 'Member Activities': {
      const matches = lib.activity.filter((a) => inRange(a.date, startDate, endDate));
      const sorted = matches.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const rows: ReportRow[] = sorted.map((a) => {
        const user = lib.getUserById(a.userId);
        return {
          id: a.id,
          member: user ? fullName(user) : 'Unknown',
          type: a.type,
          description: a.description,
          date: formatDateTime(a.date),
        };
      });
      const columns: DataTableColumn<ReportRow>[] = [
        { key: 'member', header: 'Member', render: (r) => r.member },
        { key: 'type', header: 'Type', render: (r) => r.type },
        { key: 'description', header: 'Description', render: (r) => r.description },
        { key: 'date', header: 'Date', render: (r) => r.date },
      ];
      return {
        columns,
        rows,
        stats: [
          { label: 'Total Activities', value: String(matches.length) },
          { label: 'Unique Members', value: String(new Set(matches.map((a) => a.userId)).size) },
        ],
      };
    }
    case 'Login History': {
      const matches = lib.auditLogs.filter((a) => a.module === 'Authentication' && inRange(a.date, startDate, endDate));
      const sorted = matches.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const rows: ReportRow[] = sorted.map((a) => ({
        id: a.id,
        user: a.userName,
        action: a.action,
        description: a.description,
        date: formatDateTime(a.date),
      }));
      const columns: DataTableColumn<ReportRow>[] = [
        { key: 'user', header: 'User', render: (r) => r.user },
        { key: 'action', header: 'Action', render: (r) => r.action },
        { key: 'description', header: 'Description', render: (r) => r.description },
        { key: 'date', header: 'Date', render: (r) => r.date },
      ];
      return {
        columns,
        rows,
        stats: [
          { label: 'Total Logins', value: String(matches.length) },
          { label: 'Unique Users', value: String(new Set(matches.map((a) => a.userId)).size) },
        ],
        scopeNote: 'Derived from audit log entries recorded under the Authentication module.',
      };
    }
    case 'Audit Logs': {
      const matches = lib.auditLogs.filter((a) => inRange(a.date, startDate, endDate));
      const sorted = matches.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const rows: ReportRow[] = sorted.map((a) => ({
        id: a.id,
        date: formatDateTime(a.date),
        user: a.userName,
        action: a.action,
        module: a.module,
        description: a.description,
      }));
      const columns: DataTableColumn<ReportRow>[] = [
        { key: 'date', header: 'Date', render: (r) => r.date },
        { key: 'user', header: 'User', render: (r) => r.user },
        { key: 'action', header: 'Action', render: (r) => r.action },
        { key: 'module', header: 'Module', render: (r) => r.module },
        { key: 'description', header: 'Description', render: (r) => r.description },
      ];
      return {
        columns,
        rows,
        stats: [
          { label: 'Total Entries', value: String(matches.length) },
          { label: 'Unique Users', value: String(new Set(matches.map((a) => a.userId)).size) },
          { label: 'Modules Touched', value: String(new Set(matches.map((a) => a.module)).size) },
        ],
      };
    }
    case 'System Activity': {
      const matches = lib.systemLogs.filter((s) => inRange(s.timestamp, startDate, endDate));
      const sorted = matches.slice().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      const rows: ReportRow[] = sorted.map((s) => ({
        id: s.id,
        timestamp: formatDateTime(s.timestamp),
        level: <Badge variant={LOG_LEVEL_VARIANT[s.level]}>{s.level}</Badge>,
        module: s.module,
        message: s.message,
      }));
      const columns: DataTableColumn<ReportRow>[] = [
        { key: 'timestamp', header: 'Timestamp', render: (r) => r.timestamp },
        { key: 'level', header: 'Level', render: (r) => r.level },
        { key: 'module', header: 'Module', render: (r) => r.module },
        { key: 'message', header: 'Message', render: (r) => r.message },
      ];
      return {
        columns,
        rows,
        stats: [
          { label: 'Total Entries', value: String(matches.length) },
          { label: 'Errors', value: String(matches.filter((s) => s.level === 'ERROR').length) },
          { label: 'Warnings', value: String(matches.filter((s) => s.level === 'WARNING').length) },
        ],
      };
    }
  }
}

interface GeneratedMeta {
  category: ReportCategory;
  start: string;
  end: string;
  at: string;
}

export function Reports() {
  const lib = useLibrary();
  const toast = useToast();

  const [category, setCategory] = useState<ReportCategory>('Borrowing');
  const [startDate, setStartDate] = useState(defaultStartDate());
  const [endDate, setEndDate] = useState(toInputDate(new Date()));
  const [report, setReport] = useState<ReportResult | null>(null);
  const [meta, setMeta] = useState<GeneratedMeta | null>(null);

  function handleGenerate() {
    if (!startDate || !endDate) {
      toast.error('Please select both a start and end date.');
      return;
    }
    if (startDate > endDate) {
      toast.error('Start date must be before the end date.');
      return;
    }
    setReport(buildReport(category, startDate, endDate, lib));
    setMeta({ category, start: startDate, end: endDate, at: new Date().toISOString() });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        <p className="mt-1 text-sm text-gray-500">Generate data-driven reports across the library system.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Select
            label="Category"
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={(e) => setCategory(e.target.value as ReportCategory)}
          />
          <Input label="Start Date" type="date" value={startDate} max={endDate} onChange={(e) => setStartDate(e.target.value)} />
          <Input label="End Date" type="date" value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)} />
          <div className="flex items-end">
            <Button fullWidth onClick={handleGenerate}>
              Generate Report
            </Button>
          </div>
        </div>
      </Card>

      {report && meta && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>{meta.category} Report</CardTitle>
              <p className="mt-1 text-sm text-gray-500">
                {formatDate(meta.start)} – {formatDate(meta.end)} · Generated {formatDateTime(meta.at)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<FileDown className="h-4 w-4" />}
                onClick={() => toast.info('Backend export functionality will be connected later.')}
              >
                Export PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<FileSpreadsheet className="h-4 w-4" />}
                onClick={() => toast.info('Backend export functionality will be connected later.')}
              >
                Export Excel
              </Button>
            </div>
          </CardHeader>

          {report.scopeNote && <p className="mb-4 text-xs italic text-gray-400">{report.scopeNote}</p>}

          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {report.stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs font-medium text-gray-500">{stat.label}</p>
                <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          <DataTable
            columns={report.columns}
            data={report.rows}
            keyField={(row) => String(row.id)}
            emptyTitle="No matching records"
            emptyDescription="No data was found for this category within the selected date range."
          />
        </Card>
      )}
    </div>
  );
}
