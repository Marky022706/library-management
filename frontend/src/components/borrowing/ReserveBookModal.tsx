import { useState } from 'react';
import type { Book } from '@/types';
import { Modal, Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useLibrary } from '@/hooks/useLibrary';
import { useToast } from '@/hooks/useToast';
import { formatDate, daysFromNow } from '@/utils/date';

export interface ReserveBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book;
}

export function ReserveBookModal({ isOpen, onClose, book }: ReserveBookModalProps) {
  const { currentUser } = useAuth();
  const { settings, submitReservation } = useLibrary();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const expiryDate = daysFromNow(settings.reservationDurationDays);

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleSubmit = async () => {
    if (!currentUser) return;
    setIsSubmitting(true);
    try {
      await submitReservation(currentUser.id, book.id);
      toast.success('Reservation created successfully.');
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create reservation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Reserve Book"
      description="Hold a copy of this book until it becomes available."
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting}>
            Confirm Reservation
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
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Reservation Window</dt>
            <dd className="mt-0.5 font-medium text-gray-900">{settings.reservationDurationDays} days</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Hold Expires</dt>
            <dd className="mt-0.5 font-medium text-gray-900">{formatDate(expiryDate)}</dd>
          </div>
        </dl>

        <p className="text-xs text-gray-500">
          All copies of this book are currently borrowed. You will be notified as soon as a copy is ready for
          pickup. If you do not claim it before the hold expires, your reservation will be cancelled.
        </p>
      </div>
    </Modal>
  );
}
