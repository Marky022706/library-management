import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import type { Book } from '@/types';
import { Badge, Button } from '@/components/ui';
import { cn } from '@/utils/cn';

export interface BookCardProps {
  book: Book;
  size?: 'sm' | 'md';
  /** When provided, renders a "Remove" button (e.g. for the Favorites page) instead of nothing. */
  onRemove?: () => void;
  className?: string;
}

export function BookCard({ book, size = 'md', onRemove, className }: BookCardProps) {
  const navigate = useNavigate();
  const isAvailable = book.available > 0;

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => navigate(`/member/catalog/${book.id}`)}
        className={cn(
          'flex w-full items-center justify-center overflow-hidden bg-gradient-to-br from-primary-100 to-primary-50 text-primary-400',
          size === 'sm' ? 'h-28' : 'h-40',
        )}
        aria-label={`View details for ${book.title}`}
      >
        {book.coverUrl ? (
          <img src={book.coverUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <BookOpen className={size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'} aria-hidden="true" />
        )}
      </button>
      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <div>
          <button
            type="button"
            onClick={() => navigate(`/member/catalog/${book.id}`)}
            className="line-clamp-2 text-left text-sm font-semibold text-gray-900 hover:text-primary-700"
          >
            {book.title}
          </button>
          <p className="mt-0.5 truncate text-xs text-gray-500">{book.author}</p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="neutral">{book.category}</Badge>
          <Badge variant={isAvailable ? 'success' : 'danger'} dot>
            {isAvailable ? `${book.available} available` : 'Unavailable'}
          </Badge>
        </div>
        {size !== 'sm' && <p className="text-xs text-gray-400">Condition: {book.condition}</p>}
        <div className="mt-auto flex items-center gap-2 pt-1">
          <Button size="sm" variant="outline" fullWidth onClick={() => navigate(`/member/catalog/${book.id}`)}>
            View Details
          </Button>
          {onRemove && (
            <Button size="sm" variant="danger" onClick={onRemove}>
              Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
