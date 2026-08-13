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

const EMPTY_FORM = { title: '', author: '', category: '', isbn: '', quantity: '1', condition: 'Good' as BookCondition };

export function BookFormModal({ open, book, onClose, onSubmit }: BookFormModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(
      book
        ? { title: book.title, author: book.author, category: book.category, isbn: book.isbn, quantity: String(book.quantity), condition: book.condition }
        : EMPTY_FORM,
    );
  }, [open, book]);

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.title.trim()) nextErrors.title = 'Title is required.';
    if (!form.author.trim()) nextErrors.author = 'Author is required.';
    if (!form.category.trim()) nextErrors.category = 'Category is required.';
    if (!form.isbn.trim()) nextErrors.isbn = 'ISBN is required.';
    const quantity = Number(form.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) nextErrors.quantity = 'Quantity must be at least 1.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit(
      {
        title: form.title.trim(),
        author: form.author.trim(),
        category: form.category.trim(),
        isbn: form.isbn.trim(),
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
        <Field label="Title" htmlFor="book-title" error={errors.title} required>
          <input id="book-title" className={inputClasses} value={form.title} onChange={set('title')} />
        </Field>
        <Field label="Author" htmlFor="book-author" error={errors.author} required>
          <input id="book-author" className={inputClasses} value={form.author} onChange={set('author')} />
        </Field>
        <Field label="Category" htmlFor="book-category" error={errors.category} required>
          <input id="book-category" className={inputClasses} value={form.category} onChange={set('category')} />
        </Field>
        <Field label="ISBN" htmlFor="book-isbn" error={errors.isbn} required>
          <input id="book-isbn" className={inputClasses} value={form.isbn} onChange={set('isbn')} />
        </Field>
        <Field label="Quantity" htmlFor="book-quantity" error={errors.quantity} required>
          <input id="book-quantity" type="number" min={1} className={inputClasses} value={form.quantity} onChange={set('quantity')} />
        </Field>
        <Field label="Condition" htmlFor="book-condition">
          <select id="book-condition" className={inputClasses} value={form.condition} onChange={set('condition')}>
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
