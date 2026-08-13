import { useEffect, useState } from 'react';
import type { Announcement } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Field, inputClasses } from '../common/Field';

interface AnnouncementFormModalProps {
  open: boolean;
  announcement: Announcement | null;
  onClose: () => void;
  onSubmit: (values: { title: string; content: string }, editingId?: string) => void;
  onPublishToggle?: (announcement: Announcement) => void;
}

const EMPTY_FORM = { title: '', content: '' };

export function AnnouncementFormModal({ open, announcement, onClose, onSubmit, onPublishToggle }: AnnouncementFormModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(announcement ? { title: announcement.title, content: announcement.content } : EMPTY_FORM);
  }, [open, announcement]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.title.trim()) nextErrors.title = 'Title is required.';
    if (!form.content.trim()) nextErrors.content = 'Description is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ title: form.title.trim(), content: form.content.trim() }, announcement?.id);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={announcement ? 'Edit Announcement' : 'New Announcement'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          {announcement && onPublishToggle && (
            <Button variant="secondary" onClick={() => onPublishToggle(announcement)}>
              {announcement.status === 'published' ? 'Unpublish' : 'Publish'}
            </Button>
          )}
          <Button onClick={handleSubmit}>{announcement ? 'Save Changes' : 'Save as Draft'}</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Field label="Title" htmlFor="ann-title" error={errors.title} required>
          <input id="ann-title" className={inputClasses} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
        </Field>
        <Field label="Description" htmlFor="ann-content" error={errors.content} required>
          <textarea
            id="ann-content"
            rows={5}
            className={inputClasses}
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          />
        </Field>
      </div>
    </Modal>
  );
}
