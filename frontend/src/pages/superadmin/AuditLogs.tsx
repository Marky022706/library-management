import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable';
import { Pagination } from '@/components/ui/Pagination';
import { useLibrary } from '@/hooks/useLibrary';
import { usePagination } from '@/hooks/usePagination';
import { formatDateTime } from '@/utils/date';
import type { AuditLog } from '@/types';

const PAGE_SIZE = 10;

export function AuditLogs() {
  const { auditLogs } = useLibrary();
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');

  const moduleOptions = useMemo(() => {
    const modules = Array.from(new Set(auditLogs.map((log) => log.module))).sort((a, b) => a.localeCompare(b));
    return modules.map((module) => ({ label: module, value: module }));
  }, [auditLogs]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return auditLogs.filter((log) => {
      const matchesModule = !moduleFilter || log.module === moduleFilter;
      if (!matchesModule) return false;
      if (!term) return true;
      return [log.userName, log.action, log.module, log.description].some((field) =>
        field.toLowerCase().includes(term),
      );
    });
  }, [auditLogs, search, moduleFilter]);

  const { page, totalPages, pageItems, setPage } = usePagination(filtered, PAGE_SIZE);

  const columns: DataTableColumn<AuditLog>[] = [
    {
      key: 'userName',
      header: 'User',
      render: (row) => <span className="font-medium text-gray-900">{row.userName}</span>,
    },
    { key: 'action', header: 'Action', render: (row) => row.action },
    {
      key: 'module',
      header: 'Module',
      render: (row) => <Badge variant="neutral">{row.module}</Badge>,
    },
    { key: 'description', header: 'Description', render: (row) => row.description },
    { key: 'date', header: 'Date', render: (row) => formatDateTime(row.date) },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Audit Logs</h1>

      <Card>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            placeholder="Search by user, action, module, or description..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            leftIcon={<Search className="h-4 w-4" />}
            containerClassName="sm:flex-1"
          />
          <Select
            options={moduleOptions}
            placeholder="All Modules"
            value={moduleFilter}
            onChange={(e) => {
              setModuleFilter(e.target.value);
              setPage(1);
            }}
            containerClassName="sm:w-56"
          />
        </div>

        <DataTable
          columns={columns}
          data={pageItems}
          keyField={(row) => row.id}
          emptyTitle="No audit logs found"
          emptyDescription="Try adjusting your search or filter criteria."
        />

        {filtered.length > 0 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-4" />}
      </Card>
    </div>
  );
}
