import { Archive, BookOpen, RotateCcw, SquarePen } from 'lucide-react';
import type { Book } from '../../types';
import { Badge, type BadgeTone } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';

interface BookTableProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onToggleStatus: (book: Book) => void;
}

const CONDITION_TONE: Record<Book['condition'], BadgeTone> = {
  Excellent: 'green',
  Good: 'blue',
  Fair: 'amber',
  Worn: 'red',
};

export function BookTable({ books, onEdit, onToggleStatus }: BookTableProps) {
  if (books.length === 0) {
    return <EmptyState icon={BookOpen} title="No books found" description="Try adjusting your search or filters." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead>
          <tr className="border-b border-line text-xs font-semibold uppercase tracking-wide text-muted">
            <th className="py-3 pr-4">Book</th>
            <th className="py-3 pr-4">Author</th>
            <th className="py-3 pr-4">Category</th>
            <th className="py-3 pr-4">ISBN</th>
            <th className="py-3 pr-4">Qty</th>
            <th className="py-3 pr-4">Available</th>
            <th className="py-3 pr-4">Condition</th>
            <th className="py-3 pr-4">Status</th>
            <th className="py-3 pr-0 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className="border-b border-line last:border-0 hover:bg-gray-50/60">
              <td className="py-3 pr-4">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-12 w-9 shrink-0 items-center justify-center rounded-md text-white"
                    style={{ backgroundColor: book.coverColor }}
                    aria-hidden="true"
                  >
                    <BookOpen className="h-4 w-4" />
                  </span>
                  <span className="font-medium text-ink">{book.title}</span>
                </div>
              </td>
              <td className="py-3 pr-4 text-muted">{book.author}</td>
              <td className="py-3 pr-4 text-muted">{book.category}</td>
              <td className="py-3 pr-4 text-muted">{book.isbn}</td>
              <td className="py-3 pr-4 text-ink">{book.quantity}</td>
              <td className="py-3 pr-4">
                <Badge tone={book.available === 0 ? 'red' : 'green'}>{book.available}</Badge>
              </td>
              <td className="py-3 pr-4">
                <Badge tone={CONDITION_TONE[book.condition]}>{book.condition}</Badge>
              </td>
              <td className="py-3 pr-4">
                <Badge tone={book.status === 'active' ? 'green' : 'neutral'} dot>
                  {book.status}
                </Badge>
              </td>
              <td className="py-3 pr-0">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(book)}
                    title="Edit book"
                    aria-label={`Edit ${book.title}`}
                    className="rounded-lg p-2 text-muted hover:bg-gray-100 hover:text-ink"
                  >
                    <SquarePen className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleStatus(book)}
                    title={book.status === 'active' ? 'Archive book' : 'Restore book'}
                    aria-label={`${book.status === 'active' ? 'Archive' : 'Restore'} ${book.title}`}
                    className="rounded-lg p-2 text-muted hover:bg-gray-100 hover:text-ink"
                  >
                    {book.status === 'active' ? (
                      <Archive className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
