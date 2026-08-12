import { useEffect, useState, type FormEvent } from 'react';
import type { Announcement } from '@/types';
import { Modal, Button, Input, Textarea } from '@/components/ui';

export interface AnnouncementFormInput {
  title: string;
  content: string;
}

export interface AnnouncementFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAnnouncement?: Announcement;
  onSubmit: (input: AnnouncementFormInput) => void | Promise<void>;
}

interface FormErrors {
  title?: string;
  content?: string;
}

function validate(input: AnnouncementFormInput): FormErrors {
  const errors: FormErrors = {};
  if (!input.title.trim()) errors.title = 'Title is required.';
  if (!input.content.trim()) errors.content = 'Content is required.';
  else if (input.content.trim().length < 10) errors.content = 'Content should be at least 10 characters.';
  return errors;
}

export function AnnouncementFormModal({ isOpen, onClose, initialAnnouncement, onSubmit }: AnnouncementFormModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setTitle(initialAnnouncement?.title ?? '');
    setContent(initialAnnouncement?.content ?? '');
    setErrors({});
  }, [isOpen, initialAnnouncement]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const input: AnnouncementFormInput = { title: title.trim(), content: content.trim() };
    const nextErrors = validate(input);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit(input);
    } catch {
      // The caller is responsible for surfacing the error (e.g. via a toast).
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialAnnouncement ? 'Edit Announcement' : 'New Announcement'}
      description={initialAnnouncement ? 'Update this announcement’s content.' : 'New announcements are saved as a draft first.'}
      size="md"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form="announcement-form" isLoading={isSubmitting}>
            Save Announcement
          </Button>
        </>
      }
    >
      <form id="announcement-form" onSubmit={handleSubmit} className="space-y-4">
        <Input label="Title" required value={title} onChange={(e) => setTitle(e.target.value)} error={errors.title} />
        <Textarea
          label="Content"
          required
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          error={errors.content}
        />
      </form>
    </Modal>
  );
}
