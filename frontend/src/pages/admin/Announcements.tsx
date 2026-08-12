import { useMemo, useState } from 'react';
import { Plus, Pencil, Send, Undo2, Archive, RotateCcw, Search } from 'lucide-react';
import type { Announcement, AnnouncementStatus } from '@/types';
import { Button, Input, Badge, Card, ConfirmDialog, DataTable, Pagination, type DataTableColumn } from '@/components/ui';
import { AnnouncementFormModal, type AnnouncementFormInput } from '@/components/announcements/AnnouncementFormModal';
import { useLibrary } from '@/hooks/useLibrary';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useDisclosure } from '@/hooks/useDisclosure';
import { usePagination } from '@/hooks/usePagination';
import { formatDate } from '@/utils/date';

const STATUS_VARIANT: Record<AnnouncementStatus, 'warning' | 'success' | 'neutral'> = {
  draft: 'warning',
  published: 'success',
  archived: 'neutral',
};

export function Announcements() {
  const lib = useLibrary();
  const { currentUser } = useAuth();
  const toast = useToast();

  const [search, setSearch] = useState('');

  const formModal = useDisclosure();
  const [editing, setEditing] = useState<Announcement | null>(null);

  const [archiveTarget, setArchiveTarget] = useState<Announcement | null>(null);
  const [isArchiving, setIsArchiving] = useState(false);

  const sorted = useMemo(() => {
    const query = search.trim().toLowerCase();
    return lib.announcements
      .filter((a) => !query || a.title.toLowerCase().includes(query))
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [lib.announcements, search]);

  const { page, totalPages, pageItems, setPage } = usePagination(sorted, 8);

  if (!currentUser) return null;

  function openCreate() {
    setEditing(null);
    formModal.open();
  }

  function openEdit(announcement: Announcement) {
    setEditing(announcement);
    formModal.open();
  }

  async function handleSubmit(input: AnnouncementFormInput) {
    try {
      if (editing) {
        await lib.updateAnnouncement(editing.id, input);
        toast.success('Announcement updated successfully.');
      } else {
        await lib.createAnnouncement(input, currentUser!.id);
        toast.success('Announcement created as a draft.');
      }
      formModal.close();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  function handlePublish(announcement: Announcement) {
    lib.setAnnouncementStatus(announcement.id, 'published');
    toast.success('Announcement published.');
  }

  function handleUnpublish(announcement: Announcement) {
    lib.setAnnouncementStatus(announcement.id, 'draft');
    toast.success('Announcement moved back to draft.');
  }

  function handleRestore(announcement: Announcement) {
    lib.setAnnouncementStatus(announcement.id, 'draft');
    toast.success('Announcement restored to draft.');
  }

  async function handleConfirmArchive() {
    if (!archiveTarget) return;
    setIsArchiving(true);
    try {
      lib.setAnnouncementStatus(archiveTarget.id, 'archived');
      toast.success('Announcement archived.');
      setArchiveTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsArchiving(false);
    }
  }

  const columns: DataTableColumn<Announcement>[] = [
    {
      key: 'title',
      header: 'Title',
      render: (a) => (
        <div>
          <p className="font-medium text-gray-900">{a.title}</p>
          <p className="line-clamp-1 text-xs text-gray-500">{a.content}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (a) => (
        <Badge variant={STATUS_VARIANT[a.status]} className="capitalize">
          {a.status}
        </Badge>
      ),
    },
    { key: 'created', header: 'Created', render: (a) => formatDate(a.createdAt) },
    { key: 'published', header: 'Published', render: (a) => (a.publishedAt ? formatDate(a.publishedAt) : '—') },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      headerClassName: 'text-right',
      render: (a) => (
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="!px-2"
            aria-label={`Edit ${a.title}`}
            title="Edit"
            onClick={() => openEdit(a)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          {a.status === 'draft' && (
            <>
              <Button variant="success" size="sm" leftIcon={<Send className="h-3.5 w-3.5" />} onClick={() => handlePublish(a)}>
                Publish
              </Button>
              <Button variant="outline" size="sm" leftIcon={<Archive className="h-3.5 w-3.5" />} onClick={() => setArchiveTarget(a)}>
                Archive
              </Button>
            </>
          )}
          {a.status === 'published' && (
            <>
              <Button variant="outline" size="sm" leftIcon={<Undo2 className="h-3.5 w-3.5" />} onClick={() => handleUnpublish(a)}>
                Unpublish
              </Button>
              <Button variant="outline" size="sm" leftIcon={<Archive className="h-3.5 w-3.5" />} onClick={() => setArchiveTarget(a)}>
                Archive
              </Button>
            </>
          )}
          {a.status === 'archived' && (
            <Button variant="outline" size="sm" leftIcon={<RotateCcw className="h-3.5 w-3.5" />} onClick={() => handleRestore(a)}>
              Restore to Draft
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Announcements</h1>
          <p className="mt-1 text-sm text-gray-500">Create and publish library announcements.</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
          New Announcement
        </Button>
      </div>

      <Card>
        <div className="border-b border-gray-100 pb-4">
          <Input
            placeholder="Search announcements…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            containerClassName="sm:w-72"
          />
        </div>
        <div className="pt-4">
          <DataTable
            columns={columns}
            data={pageItems}
            keyField={(a) => a.id}
            emptyTitle="No announcements yet"
            emptyDescription="Create your first announcement to share news with members."
          />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-4" />
        </div>
      </Card>

      <AnnouncementFormModal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        initialAnnouncement={editing ?? undefined}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        isOpen={archiveTarget !== null}
        title="Archive this announcement?"
        message={archiveTarget ? `"${archiveTarget.title}" will be archived and no longer visible to members.` : ''}
        confirmLabel="Archive"
        variant="danger"
        isLoading={isArchiving}
        onConfirm={handleConfirmArchive}
        onCancel={() => setArchiveTarget(null)}
      />
    </div>
  );
}
