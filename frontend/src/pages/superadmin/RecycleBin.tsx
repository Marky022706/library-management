import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable';
import { useLibrary } from '@/hooks/useLibrary';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useDisclosure } from '@/hooks/useDisclosure';
import { formatDateTime } from '@/utils/date';
import { cn } from '@/utils/cn';
import type { RecycleBinCategory, RecycleBinItem } from '@/types';

const TABS: RecycleBinCategory[] = ['Books', 'Users', 'Announcements'];

export function RecycleBin() {
  const { recycleBin, restoreRecycleItem, deleteRecycleItemPermanently } = useLibrary();
  const { currentUser } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<RecycleBinCategory>('Books');
  const [selectedItem, setSelectedItem] = useState<RecycleBinItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const restoreDialog = useDisclosure();
  const deleteDialog = useDisclosure();

  const items = useMemo(() => recycleBin.filter((item) => item.category === activeTab), [recycleBin, activeTab]);

  const openRestore = (item: RecycleBinItem) => {
    setSelectedItem(item);
    restoreDialog.open();
  };

  const openDelete = (item: RecycleBinItem) => {
    setSelectedItem(item);
    deleteDialog.open();
  };

  const closeDialogs = () => {
    restoreDialog.close();
    deleteDialog.close();
    setSelectedItem(null);
  };

  const handleRestore = async () => {
    if (!selectedItem || !currentUser) return;
    setIsProcessing(true);
    try {
      restoreRecycleItem(selectedItem.id, currentUser.id);
      toast.success('Item restored successfully.');
      closeDialogs();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to restore item.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    setIsProcessing(true);
    try {
      deleteRecycleItemPermanently(selectedItem.id);
      toast.success('Item permanently deleted.');
      closeDialogs();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete item.');
    } finally {
      setIsProcessing(false);
    }
  };

  const columns: DataTableColumn<RecycleBinItem>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (row) => <span className="font-medium text-gray-900">{row.name}</span>,
    },
    { key: 'description', header: 'Description', render: (row) => row.description },
    { key: 'deletedAt', header: 'Deleted At', render: (row) => formatDateTime(row.deletedAt) },
    { key: 'deletedBy', header: 'Deleted By', render: (row) => row.deletedBy },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => openRestore(row)}>
            Restore
          </Button>
          <Button size="sm" variant="danger" onClick={() => openDelete(row)}>
            Delete Permanently
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Recycle Bin</h1>

      <Card>
        <div className="mb-4 flex flex-wrap gap-2 border-b border-gray-200 pb-3">
          {TABS.map((tab) => {
            const count = recycleBin.filter((item) => item.category === tab).length;
            const active = tab === activeTab;
            return (
              <button
                type="button"
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
                  active ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100',
                )}
              >
                {tab}
                <span
                  className={cn(
                    'inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-semibold',
                    active ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600',
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <DataTable
          columns={columns}
          data={items}
          keyField={(row) => row.id}
          emptyTitle={`No deleted ${activeTab.toLowerCase()}`}
          emptyDescription={`Items removed from ${activeTab.toLowerCase()} will appear here.`}
        />
      </Card>

      <ConfirmDialog
        isOpen={restoreDialog.isOpen}
        title="Restore Item"
        message={`Are you sure you want to restore "${selectedItem?.name ?? ''}"? It will be moved back to its original location.`}
        confirmLabel="Restore"
        isLoading={isProcessing}
        onConfirm={handleRestore}
        onCancel={closeDialogs}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Permanently"
        message={`Are you sure you want to permanently delete "${selectedItem?.name ?? ''}"? This action cannot be undone.`}
        confirmLabel="Delete Permanently"
        variant="danger"
        isLoading={isProcessing}
        onConfirm={handleDelete}
        onCancel={closeDialogs}
      />
    </div>
  );
}
