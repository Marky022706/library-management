import { useEffect, useState } from 'react';
import type { Book, BookCondition } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Field, inputClasses } from '../common/Field';

interface BookFormModalProps {
  open: boolean;
  book: Book | null;
  onClose: () => void;
  onSubmit: (values: Omit<Book, 'id' | 'available' | 'status'>, editingId?: string) => void;
}

const CONDITIONS: BookCondition[] = ['Excellent', 'Good', 'Fair', 'Worn'];
const COVER_COLORS = ['#15803d', '#1d4ed8', '#b45309', '#7c2d12', '#be185d', '#334155'];

const EMPTY_FORM = {
  title: '',
  author: '',
  accessionNumber: '',
  pages: '',
  publisher: '',
  year: '',
  quantity: '1',
  condition: 'Good' as BookCondition,
};

export function BookFormModal({ open, book, onClose, onSubmit }: BookFormModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(
      book
        ? {
            title: book.title,
            author: book.author,
            accessionNumber: book.accessionNumber ?? '',
            pages: '',
            publisher: book.publisher ?? '',
            year: book.publicationYear ? String(book.publicationYear) : '',
            quantity: String(book.quantity),
            condition: book.condition,
          }
        : EMPTY_FORM,
    );
  }, [open, book]);

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.title.trim()) nextErrors.title = 'Book Title is required.';
    if (!form.author.trim()) nextErrors.author = 'Author is required.';
    if (!form.accessionNumber.trim()) nextErrors.accessionNumber = 'Accession Number is required.';

    const quantity = Number(form.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) nextErrors.quantity = 'Quantity must be at least 1.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit(
      {
        title: form.title.trim(),
        author: form.author.trim(),
        category: '',
        publisher: form.publisher.trim(),
        publicationYear: form.year ? Number(form.year) : undefined,
        accessionNumber: form.accessionNumber.trim(),
        pages: form.pages ? Number(form.pages) : undefined,
        isbn: '',
        shelfLocation: '',
        format: '',
        quantity,
        condition: form.condition,
        coverColor: book?.coverColor ?? COVER_COLORS[Math.floor(Math.random() * COVER_COLORS.length)],
      },
      book?.id,
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={book ? 'Edit Book' : 'Add Book'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{book ? 'Save Changes' : 'Add Book'}</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Book Title" htmlFor="book-title" error={errors.title} required>
          <input id="book-title" className={inputClasses} value={form.title} onChange={set('title')} placeholder="e.g. The Great Gatsby" />
        </Field>
        <Field label="Author" htmlFor="book-author" error={errors.author} required>
          <input id="book-author" className={inputClasses} value={form.author} onChange={set('author')} placeholder="e.g. F. Scott Fitzgerald" />
        </Field>
        <Field label="Accession Number" htmlFor="book-accession-number" error={errors.accessionNumber} required>
          <input id="book-accession-number" className={inputClasses} value={form.accessionNumber} onChange={set('accessionNumber')} placeholder="e.g. ACC-001" />
        </Field>
        <Field label="Pages" htmlFor="book-pages">
          <input id="book-pages" className={inputClasses} value={form.pages} onChange={set('pages')} placeholder="e.g. 180" />
        </Field>
        <Field label="Publisher" htmlFor="book-publisher">
          <input id="book-publisher" className={inputClasses} value={form.publisher} onChange={set('publisher')} placeholder="e.g. Scribner" />
        </Field>
        <Field label="Year" htmlFor="book-year">
          <input id="book-year" type="number" min={0} className={inputClasses} value={form.year} onChange={set('year')} placeholder="e.g. 2026" />
        </Field>
        <Field label="Quantity" htmlFor="book-quantity" error={errors.quantity} required>
          <input id="book-quantity" type="number" min={1} className={inputClasses} value={form.quantity} onChange={set('quantity')} placeholder="e.g. 1" />
        </Field>
        <Field label="Book Condition" htmlFor="book-condition" error={errors.condition} required>
          <select id="book-condition" className={inputClasses} value={form.condition} onChange={set('condition')}>
            <option value="" disabled hidden>Select condition</option>
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
      </div>
    </Modal>
  );
}
