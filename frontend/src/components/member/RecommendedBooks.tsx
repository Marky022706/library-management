import { useState, useMemo } from 'react';
import { Search, Heart, BookOpen, Check, BookmarkPlus } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import type { Book } from '../../types';

interface RecommendedBooksProps {
  books: Book[];
  favoriteIds: string[];
  onToggleFavorite: (bookId: string) => void;
  onSelectBook: (book: Book) => void;
  onBorrowBook: (book: Book) => void;
  onReserveBook: (book: Book) => void;
}

type FilterTab = 'all' | 'new' | 'popular' | 'available' | 'favorites';

export function RecommendedBooks({
  books,
  favoriteIds,
  onToggleFavorite,
  onSelectBook,
  onBorrowBook,
  onReserveBook,
}: RecommendedBooksProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const categories = useMemo(() => {
    const set = new Set(books.map((b) => b.category));
    return ['all', ...Array.from(set)];
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      if (book.status === 'archived') return false;

      const query = search.trim().toLowerCase();
      const matchSearch =
        !query ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query) ||
        book.isbn.toLowerCase().includes(query);

      const matchCategory = categoryFilter === 'all' || book.category === categoryFilter;

      if (activeTab === 'available' && book.available <= 0) return false;
      if (activeTab === 'favorites' && !favoriteIds.includes(book.id)) return false;

      return matchSearch && matchCategory;
    });
  }, [books, search, categoryFilter, activeTab, favoriteIds]);

  return (
    <div className="flex flex-col gap-4">
      {/* Search & Category Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by book title, author, category, or ISBN..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/15 transition-all"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none"
        >
          <option value="all">All Categories</option>
          {categories.filter((c) => c !== 'all').map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-3">
        {[
          { key: 'all', label: 'All Catalog' },
          { key: 'new', label: 'New Arrivals' },
          { key: 'popular', label: 'Most Borrowed' },
          { key: 'available', label: 'Available Now' },
          { key: 'favorites', label: `My Favorites (${favoriteIds.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as FilterTab)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === tab.key
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Book Cards Grid */}
      {filteredBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-12 text-center">
          <BookOpen className="h-8 w-8 text-slate-400 mb-2" />
          <p className="text-sm font-semibold text-slate-800">No books found</p>
          <p className="text-xs text-slate-500">Try adjusting your search query or filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredBooks.slice(0, 6).map((book) => {
            const isFav = favoriteIds.includes(book.id);
            const isAvail = book.available > 0;

            return (
              <div
                key={book.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    {/* Thumbnail */}
                    <div
                      style={{ backgroundColor: book.coverColor || '#16a34a' }}
                      className="flex h-16 w-12 shrink-0 items-center justify-center rounded-lg text-white shadow-sm font-bold text-base"
                    >
                      {book.title.slice(0, 1).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <Badge tone="neutral" className="text-[10px] mb-1">
                        {book.category}
                      </Badge>
                      <h3
                        onClick={() => onSelectBook(book)}
                        className="cursor-pointer font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors"
                        title={book.title}
                      >
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1">{book.author}</p>
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={() => onToggleFavorite(book.id)}
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                        isFav ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-400 hover:text-rose-500'
                      }`}
                      title={isFav ? 'Remove from favorites' : 'Save to favorites'}
                    >
                      <Heart className={`h-4 w-4 ${isFav ? 'fill-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Availability badge & info */}
                  <div className="mt-3 flex items-center justify-between text-xs border-t border-slate-100 pt-2.5">
                    <span className="text-slate-500 text-[11px]">Copies: {book.available} / {book.quantity}</span>
                    <Badge tone={isAvail ? 'green' : 'amber'} dot className="text-[10px]">
                      {isAvail ? 'AVAILABLE' : 'RESERVE ONLY'}
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSelectBook(book)}
                    className="flex-1 h-8 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    Details
                  </Button>
                  {isAvail ? (
                    <Button
                      size="sm"
                      onClick={() => onBorrowBook(book)}
                      className="flex-1 h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1"
                    >
                      <Check className="h-3 w-3" />
                      Borrow
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => onReserveBook(book)}
                      className="flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-1"
                    >
                      <BookmarkPlus className="h-3 w-3" />
                      Reserve
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
