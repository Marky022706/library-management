import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLibrary } from '@/hooks/useLibrary';
import { useToast } from '@/hooks/useToast';
import { Button, EmptyState } from '@/components/ui';
import { BookCard } from '@/components/books/BookCard';

export function Favorites() {
  const { currentUser } = useAuth();
  const lib = useLibrary();
  const toast = useToast();
  const navigate = useNavigate();

  const userId = currentUser?.id ?? '';
  const favorites = lib.favoritesByUser(userId);

  const handleRemove = (bookId: string) => {
    if (!currentUser) return;
    try {
      lib.toggleFavorite(currentUser.id, bookId);
      toast.success('Removed from favorites.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to remove favorite.');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Favorites</h1>

      {favorites.length === 0 ? (
        <EmptyState
          icon={<Heart className="h-6 w-6" aria-hidden="true" />}
          title="No favorites yet"
          description="Books you save will show up here for quick access."
          action={<Button onClick={() => navigate('/member/catalog')}>Browse Catalog</Button>}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {favorites.map((book) => (
            <BookCard key={book.id} book={book} onRemove={() => handleRemove(book.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
