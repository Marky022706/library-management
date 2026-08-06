import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  BookOpen,
  Filter,
  Plus,
  CheckCircle,
  XCircle,
  X,
  Sparkles,
  ChevronRight,
  BookCheck,
} from 'lucide-react';

interface BookItem {
  book_id: number;
  title: string;
  description: string;
  publication_year: number;
  cover_image_url: string;
  category?: { category_id: number; category_name: string };
  publisher?: { publisher_id: number; publisher_name: string };
  authors?: { author_id: number; author_name: string }[];
  available_copies_count: number;
  total_copies_count: number;
  has_digital_edition: boolean;
}

export const CatalogPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const role = user?.role?.role_name || 'Member';
  const isStaff = ['Super Admin', 'Admin', 'Librarian'].includes(role);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for Adding New Book (Staff)
  const [newBook, setNewBook] = useState({
    title: '',
    category_id: '',
    publisher_id: '',
    publication_year: new Date().getFullYear(),
    description: '',
    cover_image_url: '',
    author_ids: [] as number[],
    initial_copies: 2,
    shelf_location_id: '',
  });

  // Queries
  const { data: catalogData, isLoading } = useQuery({
    queryKey: ['catalog', search, selectedCategory, availableOnly],
    queryFn: async () => {
      const res = await api.get('/catalog', {
        params: {
          search: search || undefined,
          category_id: selectedCategory || undefined,
          available_only: availableOnly ? 'true' : undefined,
        },
      });
      return res.data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get('/categories')).data.data,
  });

  const { data: authors } = useQuery({
    queryKey: ['authors'],
    queryFn: async () => (await api.get('/authors')).data.data,
  });

  const { data: publishers } = useQuery({
    queryKey: ['publishers'],
    queryFn: async () => (await api.get('/publishers')).data.data,
  });

  const { data: shelfLocations } = useQuery({
    queryKey: ['shelfLocations'],
    queryFn: async () => (await api.get('/shelf-locations')).data.data,
  });

  // Mutation to Add Book
  const addBookMutation = useMutation({
    mutationFn: async (payload: any) => {
      return (await api.post('/admin/books', payload)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalog'] });
      setIsAddModalOpen(false);
      setNewBook({
        title: '',
        category_id: '',
        publisher_id: '',
        publication_year: new Date().getFullYear(),
        description: '',
        cover_image_url: '',
        author_ids: [],
        initial_copies: 2,
        shelf_location_id: '',
      });
    },
  });

  const books: BookItem[] = catalogData?.data || [];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBook.title || !newBook.category_id || newBook.author_ids.length === 0) {
      alert('Please fill out Title, Category, and select at least one Author.');
      return;
    }
    addBookMutation.mutate({
      ...newBook,
      category_id: Number(newBook.category_id),
      publisher_id: newBook.publisher_id ? Number(newBook.publisher_id) : null,
      shelf_location_id: newBook.shelf_location_id ? Number(newBook.shelf_location_id) : null,
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Action & Search Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Book Catalog Collection</h1>
          <p className="text-xs text-slate-400 mt-1">Search, inspect physical copy locations, and manage public library holdings.</p>
        </div>

        {isStaff && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/20 flex items-center space-x-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Title</span>
          </button>
        )}
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Live Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, author, description..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center space-x-2 bg-slate-950/70 border border-slate-700/80 rounded-xl px-3 py-2">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-slate-900 text-white">All Categories</option>
              {categories?.map((cat: any) => (
                <option key={cat.category_id} value={cat.category_id} className="bg-slate-900 text-white">
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center space-x-2 text-xs text-slate-300 bg-slate-950/70 border border-slate-700/80 rounded-xl px-3 py-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="rounded text-amber-500 focus:ring-amber-500 bg-slate-900 border-slate-700"
            />
            <span>Available Copies Only</span>
          </label>
        </div>
      </div>

      {/* Catalog Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-80 bg-slate-900/50 border border-slate-800/60 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Books Found</h3>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search keywords or filter options.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book.book_id}
              className="group bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-500/5 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Book Cover Image */}
                <div className="relative h-48 bg-slate-950 overflow-hidden flex items-center justify-center">
                  <img
                    src={book.cover_image_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80'}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-amber-300 border border-amber-500/30">
                    {book.category?.category_name || 'General'}
                  </span>

                  {book.has_digital_edition && (
                    <span className="absolute top-3 right-3 px-2 py-1 rounded-md text-[10px] font-semibold bg-indigo-500/80 backdrop-blur-md text-white flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> e-Book
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-white text-base leading-snug line-clamp-1 group-hover:text-amber-400 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-medium line-clamp-1">
                    By {book.authors?.map((a) => a.author_name).join(', ') || 'Unknown Author'} ({book.publication_year})
                  </p>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {book.description || 'No description available for this title.'}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 pt-0 border-t border-slate-800/80 mt-3 flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs">
                  {book.available_copies_count > 0 ? (
                    <span className="flex items-center text-emerald-400 font-semibold gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{book.available_copies_count}/{book.total_copies_count} Available</span>
                    </span>
                  ) : (
                    <span className="flex items-center text-rose-400 font-semibold gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Borrowed ({book.total_copies_count} copies)</span>
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setSelectedBook(book)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center space-x-1 transition-colors"
                >
                  <span>Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden">
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <img
                src={selectedBook.cover_image_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80'}
                alt={selectedBook.title}
                className="w-32 h-44 object-cover rounded-xl border border-slate-700 flex-shrink-0"
              />
              <div className="space-y-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {selectedBook.category?.category_name}
                </span>
                <h2 className="text-xl font-bold text-white">{selectedBook.title}</h2>
                <p className="text-xs text-indigo-400 font-medium">
                  Authors: {selectedBook.authors?.map((a) => a.author_name).join(', ')}
                </p>
                <p className="text-xs text-slate-400">
                  Publisher: {selectedBook.publisher?.publisher_name || 'Public Press'} ({selectedBook.publication_year})
                </p>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {selectedBook.description}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                Holding Status: <strong className="text-white">{selectedBook.available_copies_count} copies available for physical loan</strong>
              </div>
              <button
                onClick={() => {
                  alert('Borrow Request feature: Proceeds to Upload ID & Submit Loan Request in Phase 3!');
                  setSelectedBook(null);
                }}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-indigo-600 text-white font-semibold text-xs rounded-xl flex items-center space-x-2"
              >
                <BookCheck className="w-4 h-4" />
                <span>Submit Borrow Request</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Book Modal (Staff) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <Plus className="w-5 h-5 text-amber-400" />
              <span>Add New Book to Catalog</span>
            </h2>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Book Title *</label>
                <input
                  type="text"
                  required
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  placeholder="e.g. Florante at Laura"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Category *</label>
                  <select
                    required
                    value={newBook.category_id}
                    onChange={(e) => setNewBook({ ...newBook, category_id: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="">Select Category</option>
                    {categories?.map((c: any) => (
                      <option key={c.category_id} value={c.category_id}>
                        {c.category_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Publisher</label>
                  <select
                    value={newBook.publisher_id}
                    onChange={(e) => setNewBook({ ...newBook, publisher_id: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="">Select Publisher</option>
                    {publishers?.map((p: any) => (
                      <option key={p.publisher_id} value={p.publisher_id}>
                        {p.publisher_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Author(s) *</label>
                <div className="max-h-28 overflow-y-auto bg-slate-950 p-2.5 rounded-xl border border-slate-700 space-y-1">
                  {authors?.map((a: any) => (
                    <label key={a.author_id} className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newBook.author_ids.includes(a.author_id)}
                        onChange={(e) => {
                          const ids = e.target.checked
                            ? [...newBook.author_ids, a.author_id]
                            : newBook.author_ids.filter((id) => id !== a.author_id);
                          setNewBook({ ...newBook, author_ids: ids });
                        }}
                        className="rounded text-amber-500 bg-slate-900 border-slate-700"
                      />
                      <span>{a.author_name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Initial Physical Copies</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={newBook.initial_copies}
                    onChange={(e) => setNewBook({ ...newBook, initial_copies: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Shelf Location</label>
                  <select
                    value={newBook.shelf_location_id}
                    onChange={(e) => setNewBook({ ...newBook, shelf_location_id: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="">Select Shelf</option>
                    {shelfLocations?.map((s: any) => (
                      <option key={s.shelf_location_id} value={s.shelf_location_id}>
                        {s.location_code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newBook.description}
                  onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                  placeholder="Summary or synopsis of the book..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={addBookMutation.isPending}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-indigo-600 text-white font-semibold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-2"
              >
                {addBookMutation.isPending ? 'Saving...' : 'Add Book & Generate Copy Accessions'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
