import { useMemo, useState } from 'react';
import { BookX } from 'lucide-react';
import { useLibrary } from '@/hooks/useLibrary';
import { Card, EmptyState, Pagination } from '@/components/ui';
import { BookCard } from '@/components/books/BookCard';
import { BookFilters, type BookFiltersValue } from '@/components/books/BookFilters';
import { usePagination } from '@/hooks/usePagination';

const EMPTY_FILTERS: BookFiltersValue = { search: '', category: '', author: '', availability: '', format: '' };

export function BookCatalog() {
  const lib = useLibrary();
  const [filters, setFilters] = useState<BookFiltersValue>(EMPTY_FILTERS);

  const activeBooks = useMemo(() => lib.books.filter((b) => b.status === 'active'), [lib.books]);

  const categories = useMemo(
    () => Array.from(new Set(activeBooks.map((b) => b.category))).sort((a, b) => a.localeCompare(b)),
    [activeBooks],
  );
  const authors = useMemo(
    () => Array.from(new Set(activeBooks.map((b) => b.author))).sort((a, b) => a.localeCompare(b)),
    [activeBooks],
  );
  const formats = useMemo(
    () => Array.from(new Set(activeBooks.map((b) => b.format))).sort((a, b) => a.localeCompare(b)),
    [activeBooks],
  );

  const filteredBooks = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return activeBooks.filter((book) => {
      if (search && !book.title.toLowerCase().includes(search) && !book.author.toLowerCase().includes(search)) {
        return false;
      }
      if (filters.category && book.category !== filters.category) return false;
      if (filters.author && book.author !== filters.author) return false;
      if (filters.format && book.format !== filters.format) return false;
      if (filters.availability === 'available' && book.available <= 0) return false;
      if (filters.availability === 'unavailable' && book.available > 0) return false;
      return true;
    });
  }, [activeBooks, filters]);

  const { page, totalPages, pageItems, setPage } = usePagination(filteredBooks, 12);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Book Catalog</h1>

      <Card>
        <BookFilters value={filters} onChange={setFilters} categories={categories} authors={authors} formats={formats} />
      </Card>

      {filteredBooks.length === 0 ? (
        <EmptyState
          icon={<BookX className="h-6 w-6" aria-hidden="true" />}
          title="No books found"
          description="Try adjusting your search or filters to find what you're looking for."
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {pageItems.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
