import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { Spinner } from './Spinner';
import { EmptyState } from './EmptyState';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyField: (row: T) => string;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  keyField,
  isLoading,
  emptyTitle = 'No records found',
  emptyDescription = 'There is nothing to show here yet.',
  emptyIcon,
}: DataTableProps<T>) {
  if (isLoading) return <Spinner label="Loading records…" />;

  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} icon={emptyIcon} />;
  }

  return (
    <div className="-mx-4 overflow-x-auto sm:mx-0">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-500">
            {columns.map((col) => (
              <th key={col.key} scope="col" className={cn('whitespace-nowrap px-4 py-3', col.headerClassName)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row) => (
            <tr key={keyField(row)} className="transition-colors hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.key} className={cn('px-4 py-3 align-middle text-gray-700', col.className)}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
