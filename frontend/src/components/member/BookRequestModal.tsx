import { useState } from 'react';
import { ShoppingBag, CheckCircle2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Field } from '../common/Field';

interface BookRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; author: string; publisher?: string; isbn?: string; reason?: string }) => void;
}

export function BookRequestModal({ isOpen, onClose, onSubmit }: BookRequestModalProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [isbn, setIsbn] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    onSubmit({
      title: title.trim(),
      author: author.trim(),
      publisher: publisher.trim() || undefined,
      isbn: isbn.trim() || undefined,
      reason: reason.trim() || undefined,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTitle('');
      setAuthor('');
      setPublisher('');
      setIsbn('');
      setReason('');
      onClose();
    }, 1500);
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Request a Book Acquisition"
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || !author.trim() || submitted}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
          >
            <ShoppingBag className="h-4 w-4" />
            Submit Acquisition Request
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
        <p className="text-slate-500 text-xs">
          Can’t find the book you are looking for? Submit an acquisition recommendation to the Balingasag Public Library staff for review and purchasing.
        </p>

        {submitted && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-emerald-900 font-medium">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>Thank you! Your book recommendation has been submitted to the library administration.</span>
          </div>
        )}

        <Field label="Book Title *" htmlFor="req-title" required>
          <input
            id="req-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Designing Data-Intensive Applications"
            className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
          />
        </Field>

        <Field label="Author *" htmlFor="req-author" required>
          <input
            id="req-author"
            type="text"
            required
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="e.g. Martin Kleppmann"
            className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
          />
        </Field>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Publisher (Optional)" htmlFor="req-publisher">
            <input
              id="req-publisher"
              type="text"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              placeholder="e.g. O'Reilly Media"
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
            />
          </Field>

          <Field label="ISBN (Optional)" htmlFor="req-isbn">
            <input
              id="req-isbn"
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              placeholder="e.g. 978-1449373320"
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
            />
          </Field>
        </div>

        <Field label="Reason / Remarks (Optional)" htmlFor="req-reason">
          <textarea
            id="req-reason"
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Required reference material for CS 301 database course research."
            className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
          />
        </Field>
      </form>
    </Modal>
  );
}
