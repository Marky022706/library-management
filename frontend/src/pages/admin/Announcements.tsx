import { useMemo, useState } from 'react';
import { Megaphone, Plus } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Dropdown } from '../../components/common/Dropdown';
import { EmptyState } from '../../components/common/EmptyState';
import { AnnouncementCard } from '../../components/announcements/AnnouncementCard';
import { AnnouncementFormModal } from '../../components/announcements/AnnouncementFormModal';
import { useLibraryData } from '../../context/LibraryDataContext';
import { useToast } from '../../context/ToastContext';
import type { Announcement } from '../../types';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Published & Draft' },
  { value: 'archived', label: 'Archived' },
  { value: 'all', label: 'All' },
];

export function Announcements() {
  const { announcements, addAnnouncement, updateAnnouncement, setAnnouncementStatus } = useLibraryData();
  const { showToast } = useToast();

  const [statusFilter, setStatusFilter] = useState('active');
  const [formOpen, setFormOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  const visibleAnnouncements = useMemo(() => {
    const sorted = [...announcements].sort((a, b) => (a.date < b.date ? 1 : -1));
    if (statusFilter === 'all') return sorted;
    if (statusFilter === 'archived') return sorted.filter((a) => a.status === 'archived');
    return sorted.filter((a) => a.status !== 'archived');
  }, [announcements, statusFilter]);

  const openCreateModal = () => {
    setEditingAnnouncement(null);
    setFormOpen(true);
  };

  const openEditModal = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormOpen(true);
  };

  const handleSubmit = (values: { title: string; content: string }, editingId?: string) => {
    if (editingId) {
      updateAnnouncement(editingId, values);
      showToast('Announcement updated successfully.');
    } else {
      addAnnouncement(values);
      showToast('Announcement saved as a draft.');
    }
    setFormOpen(false);
  };

  const handlePublishToggle = (announcement: Announcement) => {
    const nextStatus = announcement.status === 'published' ? 'draft' : 'published';
    setAnnouncementStatus(announcement.id, nextStatus);
    showToast(nextStatus === 'published' ? 'Announcement published.' : 'Announcement unpublished.');
    setFormOpen(false);
  };

  const handleToggleArchive = (announcement: Announcement) => {
    const nextStatus = announcement.status === 'archived' ? 'published' : 'archived';
    setAnnouncementStatus(announcement.id, nextStatus);
    showToast(nextStatus === 'archived' ? 'Announcement archived.' : 'Announcement restored.');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink">Announcements</h1>
        <Button icon={<Plus className="h-4 w-4" aria-hidden="true" />} onClick={openCreateModal}>
          New Announcement
        </Button>
      </div>

      <div className="flex justify-end">
        <Dropdown value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} label="Filter by status" />
      </div>

      {visibleAnnouncements.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white">
          <EmptyState icon={Megaphone} title="No announcements" description="Try a different filter, or create a new announcement." />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {visibleAnnouncements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} onEdit={openEditModal} onToggleArchive={handleToggleArchive} />
          ))}
        </div>
      )}

      <AnnouncementFormModal
        open={formOpen}
        announcement={editingAnnouncement}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        onPublishToggle={handlePublishToggle}
      />
    </div>
  );
}
