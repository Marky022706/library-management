import { useEffect, useState, type FormEvent } from 'react';
import type { Book, BookCondition, BookFormat, BookInput } from '@/types';
import { Modal, Button, Input, Select, Textarea } from '@/components/ui';

export interface BookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Pass the book being edited, or omit/undefined to create a new book. */
  initialBook?: Book;
  onSubmit: (input: BookInput) => Promise<void>;
}

interface FormState {
  title: string;
  author: string;
  category: string;
  publisher: string;
  publicationYear: string;
  accessionNumber: string;
  isbn: string;
  shelfLocation: string;
  format: BookFormat;
  quantity: string;
  condition: BookCondition;
  description: string;
}

const FORMAT_OPTIONS = [
  { label: 'Hardcover', value: 'Hardcover' },
  { label: 'Paperback', value: 'Paperback' },
  { label: 'E-Book', value: 'E-Book' },
  { label: 'Audiobook', value: 'Audiobook' },
];

const CONDITION_OPTIONS = [
  { label: 'New', value: 'New' },
  { label: 'Good', value: 'Good' },
  { label: 'Fair', value: 'Fair' },
  { label: 'Worn', value: 'Worn' },
  { label: 'Damaged', value: 'Damaged' },
];

function emptyForm(): FormState {
  return {
    title: '',
    author: '',
    category: '',
    publisher: '',
    publicationYear: '',
    accessionNumber: '',
    isbn: '',
    shelfLocation: '',
    format: 'Paperback',
    quantity: '1',
    condition: 'Good',
    description: '',
  };
}

function formFromBook(book: Book): FormState {
  return {
    title: book.title,
    author: book.author,
    category: book.category,
    publisher: book.publisher,
    publicationYear: String(book.publicationYear),
    accessionNumber: book.accessionNumber,
    isbn: book.isbn,
    shelfLocation: book.shelfLocation,
    format: book.format,
    quantity: String(book.quantity),
    condition: book.condition,
    description: book.description ?? '',
  };
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const CURRENT_YEAR = new Date().getFullYear();

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.title.trim()) errors.title = 'Title is required.';
  if (!form.author.trim()) errors.author = 'Author is required.';
  if (!form.category.trim()) errors.category = 'Category is required.';
  if (!form.publisher.trim()) errors.publisher = 'Publisher is required.';
  if (!form.accessionNumber.trim()) errors.accessionNumber = 'Accession number is required.';
  if (!form.isbn.trim()) errors.isbn = 'ISBN is required.';
  if (!form.shelfLocation.trim()) errors.shelfLocation = 'Shelf location is required.';

  const year = Number(form.publicationYear);
  if (!form.publicationYear.trim() || !Number.isInteger(year) || year < 1450 || year > CURRENT_YEAR + 1) {
    errors.publicationYear = `Enter a valid 4-digit year between 1450 and ${CURRENT_YEAR + 1}.`;
  }

  const quantity = Number(form.quantity);
  if (!form.quantity.trim() || !Number.isInteger(quantity) || quantity <= 0) {
    errors.quantity = 'Quantity must be a whole number greater than 0.';
  }

  return errors;
}

export function BookFormModal({ isOpen, onClose, initialBook, onSubmit }: BookFormModalProps) {
  const [form, setForm] = useState<FormState>(() => (initialBook ? formFromBook(initialBook) : emptyForm()));
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setForm(initialBook ? formFromBook(initialBook) : emptyForm());
    setErrors({});
  }, [isOpen, initialBook]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const input: BookInput = {
      title: form.title.trim(),
      author: form.author.trim(),
      category: form.category.trim(),
      publisher: form.publisher.trim(),
      publicationYear: Number(form.publicationYear),
      accessionNumber: form.accessionNumber.trim(),
      isbn: form.isbn.trim(),
      shelfLocation: form.shelfLocation.trim(),
      format: form.format,
      quantity: Number(form.quantity),
      condition: form.condition,
      description: form.description.trim() || undefined,
      coverUrl: initialBook?.coverUrl,
    };

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
      title={initialBook ? 'Edit Book' : 'Add Book'}
      description={initialBook ? 'Update this title’s catalog details.' : 'Add a new title to the library catalog.'}
      size="lg"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form="book-form" isLoading={isSubmitting}>
            Save Book
          </Button>
        </>
      }
    >
      <form id="book-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Title"
            required
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            error={errors.title}
          />
          <Input
            label="Author"
            required
            value={form.author}
            onChange={(e) => updateField('author', e.target.value)}
            error={errors.author}
          />
          <Input
            label="Category"
            required
            value={form.category}
            onChange={(e) => updateField('category', e.target.value)}
            error={errors.category}
            placeholder="e.g. Fiction, Science, Reference"
          />
          <Input
            label="Publisher"
            required
            value={form.publisher}
            onChange={(e) => updateField('publisher', e.target.value)}
            error={errors.publisher}
          />
          <Input
            label="Publication Year"
            required
            inputMode="numeric"
            value={form.publicationYear}
            onChange={(e) => updateField('publicationYear', e.target.value)}
            error={errors.publicationYear}
          />
          <Input
            label="Accession Number"
            required
            value={form.accessionNumber}
            onChange={(e) => updateField('accessionNumber', e.target.value)}
            error={errors.accessionNumber}
          />
          <Input
            label="ISBN"
            required
            value={form.isbn}
            onChange={(e) => updateField('isbn', e.target.value)}
            error={errors.isbn}
          />
          <Input
            label="Shelf Location"
            required
            value={form.shelfLocation}
            onChange={(e) => updateField('shelfLocation', e.target.value)}
            error={errors.shelfLocation}
          />
          <Select
            label="Format"
            required
            options={FORMAT_OPTIONS}
            value={form.format}
            onChange={(e) => updateField('format', e.target.value as BookFormat)}
          />
          <Input
            label="Quantity"
            required
            type="number"
            min={1}
            step={1}
            value={form.quantity}
            onChange={(e) => updateField('quantity', e.target.value)}
            error={errors.quantity}
          />
          <Select
            label="Condition"
            required
            options={CONDITION_OPTIONS}
            value={form.condition}
            onChange={(e) => updateField('condition', e.target.value as BookCondition)}
          />
        </div>
        <Textarea
          label="Description"
          hint="Optional — shown to members on the book's details page."
          rows={3}
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
        />
      </form>
    </Modal>
  );
}
