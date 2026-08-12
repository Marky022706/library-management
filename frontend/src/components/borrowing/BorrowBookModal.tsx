import { useState } from 'react';
import type { Book } from '@/types';
import { Modal, Button, FileUpload } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useLibrary } from '@/hooks/useLibrary';
import { useToast } from '@/hooks/useToast';
import { formatDate, daysFromNow } from '@/utils/date';

export interface BorrowBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book;
}

export function BorrowBookModal({ isOpen, onClose, book }: BorrowBookModalProps) {
  const { currentUser } = useAuth();
  const { settings, submitBorrowRequest } = useLibrary();
  const toast = useToast();
  const [idFile, setIdFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dueDate = daysFromNow(settings.loanDurationDays);

  const handleClose = () => {
    if (isSubmitting) return;
    setIdFile(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!currentUser) return;
    setIsSubmitting(true);
    try {
      await submitBorrowRequest(currentUser.id, book.id, idFile?.name);
      toast.success('Request submitted successfully.');
      setIdFile(null);
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit borrow request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Borrow Book"
      description="Review the borrowing terms before submitting your request."
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting}>
            Submit Request
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <p className="text-sm font-semibold text-gray-900">{book.title}</p>
          <p className="text-xs text-gray-500">
            {book.author} · {book.category}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Loan Duration</dt>
            <dd className="mt-0.5 font-medium text-gray-900">{settings.loanDurationDays} days</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Due Date</dt>
            <dd className="mt-0.5 font-medium text-gray-900">{formatDate(dueDate)}</dd>
          </div>
        </dl>

        <FileUpload
          label="Upload a valid ID (optional)"
          hint="Accepted for verification at the counter — image or PDF"
          accept="image/*,.pdf"
          value={idFile}
          onChange={setIdFile}
        />

        <p className="text-xs text-gray-500">
          Your request will be reviewed by library staff. You will be notified once it is approved and ready for
          pickup at the circulation desk.
        </p>
      </div>
    </Modal>
  );
}
