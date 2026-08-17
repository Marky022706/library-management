import { useEffect, useMemo, useState, type ComponentProps } from 'react';
import { Plus } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { SearchInput } from '../../components/common/SearchInput';
import { Dropdown } from '../../components/common/Dropdown';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { BookTable } from '../../components/books/BookTable';
import { BookFormModal } from '../../components/books/BookFormModal';
import { useLibraryData } from '../../context/LibraryDataContext';
import { useToast } from '../../context/ToastContext';
import type { Book } from '../../types';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
  { value: 'all', label: 'All' },
];

export function BookManagement() {
  const { books, addBook, updateBook, setBookStatus, refreshBooks } = useLibraryData();
  const { showToast } = useToast();

  useEffect(() => {
    refreshBooks();
  }, []);

  // Clear selection when search or filter changes
  useEffect(() => {
    setSelectedBookIds(new Set());
  }, [search, statusFilter]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [formOpen, setFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [pendingToggle, setPendingToggle] = useState<Book | null>(null);
  const [selectedBookIds, setSelectedBookIds] = useState<Set<string>>(new Set());

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return books.filter((book) => {
      const matchesStatus = statusFilter === 'all' || book.status === statusFilter;
      const matchesSearch =
        !query ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.isbn.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [books, search, statusFilter]);

  const openAddModal = () => {
    setEditingBook(null);
    setFormOpen(true);
  };

  const openEditModal = (book: Book) => {
    setEditingBook(book);
    setFormOpen(true);
  };

  const handleSubmit: ComponentProps<typeof BookFormModal>['onSubmit'] = (values, editingId) => {
    if (editingId) {
      updateBook(editingId, values);
      showToast('Book updated successfully.');
    } else {
      addBook(values);
      showToast('Book added successfully.');
    }
    setFormOpen(false);
  };

  const confirmToggleStatus = () => {
    if (!pendingToggle) return;
    const nextStatus = pendingToggle.status === 'active' ? 'archived' : 'active';
    setBookStatus(pendingToggle.id, nextStatus);
    showToast(nextStatus === 'archived' ? 'Book archived.' : 'Book restored.');
    setPendingToggle(null);
  };

  const handleSelectBook = (bookId: string, selected: boolean) => {
    setSelectedBookIds((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(bookId);
      } else {
        next.delete(bookId);
      }
      return next;
    });
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedBookIds(new Set(filteredBooks.map((b) => b.id)));
    } else {
      setSelectedBookIds(new Set());
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink">Book Management</h1>
        <Button icon={<Plus className="h-4 w-4" aria-hidden="true" />} onClick={openAddModal}>
          Add Book
        </Button>
      </div>

      <Card>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <SearchInput value={search} onChange={setSearch} placeholder="Search books..." label="Search books" />
          </div>
          <Dropdown value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} label="Filter by status" />
        </div>

        <BookTable\n          books={filteredBooks}\n          selectedBookIds={selectedBookIds}\n          onSelectBook={handleSelectBook}\n          onSelectAll={handleSelectAll}\n          onEdit={openEditModal}\n          onToggleStatus={setPendingToggle}\n        />
      </Card>

      <BookFormModal open={formOpen} book={editingBook} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} />

      <ConfirmDialog
        open={Boolean(pendingToggle)}
        title={pendingToggle?.status === 'active' ? 'Archive book?' : 'Restore book?'}
        message={
          pendingToggle?.status === 'active'
            ? `"${pendingToggle?.title}" will be marked archived and hidden from the active catalog.`
            : `"${pendingToggle?.title}" will be restored to the active catalog.`
        }
        confirmLabel={pendingToggle?.status === 'active' ? 'Archive' : 'Restore'}
        danger={pendingToggle?.status === 'active'}
        onConfirm={confirmToggleStatus}
        onCancel={() => setPendingToggle(null)}
      />
    </div>
  );
}
