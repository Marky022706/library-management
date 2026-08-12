import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BookOpen, Heart, ArrowLeft, MapPin, Layers, Hash, CalendarDays, Building2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLibrary } from '@/hooks/useLibrary';
import { useToast } from '@/hooks/useToast';
import { useDisclosure } from '@/hooks/useDisclosure';
import { Badge, Button, Card, EmptyState } from '@/components/ui';
import { BorrowBookModal } from '@/components/borrowing/BorrowBookModal';
import { ReserveBookModal } from '@/components/borrowing/ReserveBookModal';

export function BookDetails() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const lib = useLibrary();
  const toast = useToast();
  const borrowModal = useDisclosure();
  const reserveModal = useDisclosure();
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const book = bookId ? lib.getBookById(bookId) : undefined;

  if (!book) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Book Details</h1>
        <EmptyState
          icon={<BookOpen className="h-6 w-6" aria-hidden="true" />}
          title="Book not found"
          description="This book may have been removed from the catalog."
          action={
            <Button leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate('/member/catalog')}>
              Back to Catalog
            </Button>
          }
        />
      </div>
    );
  }

  const isFavorite = currentUser ? lib.isFavorite(currentUser.id, book.id) : false;
  const isAvailable = book.available > 0;

  const handleToggleFavorite = () => {
    if (!currentUser) return;
    setIsTogglingFavorite(true);
    try {
      lib.toggleFavorite(currentUser.id, book.id);
      toast.success(isFavorite ? 'Removed from favorites.' : 'Added to favorites.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update favorites.');
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate('/member/catalog')}>
          Back to Catalog
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="flex items-center justify-center lg:col-span-1" padding="lg">
          <div className="flex h-64 w-full max-w-[220px] items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-primary-100 to-primary-50 text-primary-400">
            {book.coverUrl ? (
              <img src={book.coverUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <BookOpen className="h-16 w-16" aria-hidden="true" />
            )}
          </div>
        </Card>

        <Card className="lg:col-span-2" padding="lg">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{book.title}</h1>
              <p className="mt-1 text-sm text-gray-500">by {book.author}</p>
            </div>
            <Badge variant={isAvailable ? 'success' : 'danger'} dot>
              {isAvailable ? `${book.available} of ${book.quantity} available` : 'Unavailable'}
            </Badge>
          </div>

          {book.description && <p className="mt-4 text-sm text-gray-600">{book.description}</p>}

          <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailRow icon={Layers} label="Category" value={book.category} />
            <DetailRow icon={Building2} label="Publisher" value={book.publisher} />
            <DetailRow icon={CalendarDays} label="Publication Year" value={String(book.publicationYear)} />
            <DetailRow icon={Hash} label="ISBN" value={book.isbn} />
            <DetailRow icon={MapPin} label="Shelf Location" value={book.shelfLocation} />
            <DetailRow icon={BookOpen} label="Format" value={book.format} />
            <DetailRow icon={Layers} label="Condition" value={book.condition} />
          </dl>

          <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-100 pt-5">
            <Button disabled={!isAvailable} onClick={borrowModal.open}>
              Borrow Book
            </Button>
            <Button variant="outline" disabled={isAvailable} onClick={reserveModal.open}>
              Reserve Book
            </Button>
            <Button
              variant="ghost"
              leftIcon={<Heart className="h-4 w-4" fill={isFavorite ? 'currentColor' : 'none'} />}
              isLoading={isTogglingFavorite}
              onClick={handleToggleFavorite}
              className={isFavorite ? 'text-red-600 hover:bg-red-50' : ''}
            >
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
          </div>
          {!isAvailable && (
            <p className="mt-3 text-xs text-gray-500">
              All copies are currently borrowed. Reserve this title to be notified when a copy becomes available.
            </p>
          )}
        </Card>
      </div>

      <BorrowBookModal isOpen={borrowModal.isOpen} onClose={borrowModal.close} book={book} />
      <ReserveBookModal isOpen={reserveModal.isOpen} onClose={reserveModal.close} book={book} />
    </div>
  );
}

interface DetailRowProps {
  icon: typeof BookOpen;
  label: string;
  value: string;
}

function DetailRow({ icon: Icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
      <div>
        <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</dt>
        <dd className="text-sm font-medium text-gray-900">{value}</dd>
      </div>
    </div>
  );
}
