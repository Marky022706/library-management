import { useState } from 'react';
import { DatabaseBackup } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable';
import { EmptyState } from '@/components/ui/EmptyState';
import { useLibrary } from '@/hooks/useLibrary';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useDisclosure } from '@/hooks/useDisclosure';
import { formatDateTime } from '@/utils/date';
import type { BackupRecord, BackupStatus } from '@/types';

const STATUS_BADGE: Record<BackupStatus, BadgeVariant> = {
  completed: 'success',
  failed: 'danger',
  'in-progress': 'warning',
};

const STATUS_LABEL: Record<BackupStatus, string> = {
  completed: 'Completed',
  failed: 'Failed',
  'in-progress': 'In Progress',
};

export function BackupRestore() {
  const { backups, createBackup, restoreBackup } = useLibrary();
  const { currentUser } = useAuth();
  const toast = useToast();

  const [isCreating, setIsCreating] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupRecord | null>(null);
  const restoreDialog = useDisclosure();

  const lastBackup = backups[0];

  const handleCreateBackup = async () => {
    if (!currentUser) {
      toast.error('You must be signed in to create a backup.');
      return;
    }
    setIsCreating(true);
    try {
      await createBackup(currentUser.id);
      toast.success('Backup created successfully.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create backup.');
    } finally {
      setIsCreating(false);
    }
  };

  const openRestore = (backup: BackupRecord) => {
    setSelectedBackup(backup);
    restoreDialog.open();
  };

  const closeRestore = () => {
    restoreDialog.close();
    setSelectedBackup(null);
  };

  const handleRestore = async () => {
    if (!selectedBackup || !currentUser) return;
    setIsRestoring(true);
    try {
      await restoreBackup(selectedBackup.id, currentUser.id);
      toast.success('System restored from backup (simulated).');
      closeRestore();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to restore backup.');
    } finally {
      setIsRestoring(false);
    }
  };

  const columns: DataTableColumn<BackupRecord>[] = [
    { key: 'createdAt', header: 'Created At', render: (row) => formatDateTime(row.createdAt) },
    { key: 'sizeMb', header: 'Size', render: (row) => `${row.sizeMb} MB` },
    { key: 'createdBy', header: 'Created By', render: (row) => row.createdBy },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <Badge variant={STATUS_BADGE[row.status]}>{STATUS_LABEL[row.status]}</Badge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <Button size="sm" variant="outline" onClick={() => openRestore(row)} disabled={row.status !== 'completed'}>
          Restore
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Backup & Restore</h1>
        <Button onClick={handleCreateBackup} isLoading={isCreating}>
          Create Backup
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Last Backup Summary</CardTitle>
        </CardHeader>
        {lastBackup ? (
          <dl className="grid gap-4 sm:grid-cols-4">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Date</dt>
              <dd className="mt-1 text-sm font-semibold text-gray-900">{formatDateTime(lastBackup.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Size</dt>
              <dd className="mt-1 text-sm font-semibold text-gray-900">{lastBackup.sizeMb} MB</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Created By</dt>
              <dd className="mt-1 text-sm font-semibold text-gray-900">{lastBackup.createdBy}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Status</dt>
              <dd className="mt-1">
                <Badge variant={STATUS_BADGE[lastBackup.status]}>{STATUS_LABEL[lastBackup.status]}</Badge>
              </dd>
            </div>
          </dl>
        ) : (
          <EmptyState
            icon={<DatabaseBackup className="h-6 w-6" aria-hidden="true" />}
            title="No backups yet"
            description="Create your first backup to see a summary here."
          />
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backup History</CardTitle>
        </CardHeader>
        <DataTable
          columns={columns}
          data={backups}
          keyField={(row) => row.id}
          emptyTitle="No backups found"
          emptyDescription="Create a backup to start building a history."
        />
      </Card>

      <ConfirmDialog
        isOpen={restoreDialog.isOpen}
        title="Restore from Backup"
        message={`This will simulate restoring system data to the state captured on ${
          selectedBackup ? formatDateTime(selectedBackup.createdAt) : ''
        }. Current data will be overwritten.`}
        confirmLabel="Restore"
        variant="danger"
        isLoading={isRestoring}
        onConfirm={handleRestore}
        onCancel={closeRestore}
      />
    </div>
  );
}
