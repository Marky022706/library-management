import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable';
import { Pagination } from '@/components/ui/Pagination';
import { useLibrary } from '@/hooks/useLibrary';
import { usePagination } from '@/hooks/usePagination';
import { formatDateTime } from '@/utils/date';
import type { SystemLog, LogLevel } from '@/types';

const PAGE_SIZE = 10;

const LEVEL_BADGE: Record<LogLevel, BadgeVariant> = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'danger',
};

const LEVEL_OPTIONS = [
  { label: 'INFO', value: 'INFO' },
  { label: 'WARNING', value: 'WARNING' },
  { label: 'ERROR', value: 'ERROR' },
];

export function SystemLogs() {
  const { systemLogs } = useLibrary();
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return systemLogs.filter((log) => {
      const matchesLevel = !levelFilter || log.level === levelFilter;
      if (!matchesLevel) return false;
      if (!term) return true;
      return [log.module, log.message].some((field) => field.toLowerCase().includes(term));
    });
  }, [systemLogs, search, levelFilter]);

  const { page, totalPages, pageItems, setPage } = usePagination(filtered, PAGE_SIZE);

  const columns: DataTableColumn<SystemLog>[] = [
    { key: 'timestamp', header: 'Timestamp', render: (row) => formatDateTime(row.timestamp) },
    {
      key: 'level',
      header: 'Level',
      render: (row) => <Badge variant={LEVEL_BADGE[row.level]}>{row.level}</Badge>,
    },
    { key: 'module', header: 'Module', render: (row) => row.module },
    { key: 'message', header: 'Message', render: (row) => row.message },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">System Logs</h1>

      <Card>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            placeholder="Search by module or message..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            leftIcon={<Search className="h-4 w-4" />}
            containerClassName="sm:flex-1"
          />
          <Select
            options={LEVEL_OPTIONS}
            placeholder="All Levels"
            value={levelFilter}
            onChange={(e) => {
              setLevelFilter(e.target.value);
              setPage(1);
            }}
            containerClassName="sm:w-48"
          />
        </div>

        <DataTable
          columns={columns}
          data={pageItems}
          keyField={(row) => row.id}
          emptyTitle="No system logs found"
          emptyDescription="Try adjusting your search or filter criteria."
        />

        {filtered.length > 0 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-4" />}
      </Card>
    </div>
  );
}
