import { useMemo, useState } from 'react';
import { Plus, Search, Eye, Pencil, Archive, ArchiveRestore, QrCode, History } from 'lucide-react';
import type { Book, BookCondition, BookInput, BookStatus } from '@/types';
import {
  Button,
  Input,
  Select,
  Badge,
  Card,
  Modal,
  ConfirmDialog,
  DataTable,
  Pagination,
  QrPlaceholder,
  type DataTableColumn,
} from '@/components/ui';
import { BookFormModal } from '@/components/books/BookFormModal';
import { BookHistoryModal } from '@/components/books/BookHistoryModal';
import { useLibrary } from '@/hooks/useLibrary';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useDisclosure } from '@/hooks/useDisclosure';
import { usePagination } from '@/hooks/usePagination';
import { formatDate } from '@/utils/date';
import { cn } from '@/utils/cn';

const CONDITION_VARIANT: Record<BookCondition, 'success' | 'info' | 'warning' | 'danger'> = {
  New: 'success',
  Good: 'info',
  Fair: 'warning',
  Worn: 'warning',
  Damaged: 'danger',
};

const STATUS_VARIANT: Record<BookStatus, 'success' | 'neutral'> = {
  active: 'success',
  archived: 'neutral',
};

interface ArchiveTarget {
  book: Book;
  action: 'archive' | 'restore';
}

export function Books() {
  const lib = useLibrary();
  const { currentUser } = useAuth();
  const toast = useToast();

  const [statusFilter, setStatusFilter] = useState<BookStatus>('active');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const formModal = useDisclosure();
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const viewModal = useDisclosure();
  const [viewedBook, setViewedBook] = useState<Book | null>(null);

  const qrModal = useDisclosure();
  const [qrBook, setQrBook] = useState<Book | null>(null);

  const historyModal = useDisclosure();
  const [historyBook, setHistoryBook] = useState<Book | null>(null);

  const [archiveTarget, setArchiveTarget] = useState<ArchiveTarget | null>(null);
  const [isArchiving, setIsArchiving] = useState(false);

  const categories = useMemo(
    () => Array.from(new Set(lib.books.map((b) => b.category))).sort((a, b) => a.localeCompare(b)),
    [lib.books],
  );

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return lib.books.filter((book) => {
      if (book.status !== statusFilter) return false;
      if (categoryFilter && book.category !== categoryFilter) return false;
      if (query && !book.title.toLowerCase().includes(query) && !book.author.toLowerCase().includes(query)) {
        return false;
      }
      return true;
    });
  }, [lib.books, statusFilter, categoryFilter, search]);

  const { page, totalPages, pageItems, setPage } = usePagination(filteredBooks, 8);

  if (!currentUser) return null;

  function openCreate() {
    setEditingBook(null);
    formModal.open();
  }

  function openEdit(book: Book) {
    setEditingBook(book);
    formModal.open();
  }

  async function handleFormSubmit(input: BookInput) {
    try {
      if (editingBook) {
        await lib.updateBook(editingBook.id, input, currentUser!.id);
        toast.success('Book updated successfully.');
      } else {
        await lib.addBook(input, currentUser!.id);
        toast.success('Book added successfully.');
      }
      formModal.close();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  async function handleConfirmArchive() {
    if (!archiveTarget) return;
    setIsArchiving(true);
    try {
      if (archiveTarget.action === 'archive') {
        await lib.archiveBook(archiveTarget.book.id, currentUser!.id);
        toast.success('Book archived successfully.');
      } else {
        await lib.restoreBook(archiveTarget.book.id, currentUser!.id);
        toast.success('Book restored successfully.');
      }
      setArchiveTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsArchiving(false);
    }
  }

  const columns: DataTableColumn<Book>[] = [
    {
      key: 'book',
      header: 'Book',
      render: (book) => (
        <div>
          <p className="font-medium text-gray-900">{book.title}</p>
          <p className="text-xs text-gray-500">{book.author}</p>
        </div>
      ),
    },
    { key: 'category', header: 'Category', render: (book) => book.category },
    { key: 'isbn', header: 'ISBN', render: (book) => <span className="font-mono text-xs">{book.isbn}</span> },
    { key: 'quantity', header: 'Quantity', render: (book) => book.quantity },
    { key: 'available', header: 'Available', render: (book) => book.available },
    {
      key: 'condition',
      header: 'Condition',
      render: (book) => <Badge variant={CONDITION_VARIANT[book.condition]}>{book.condition}</Badge>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (book) => (
        <Badge variant={STATUS_VARIANT[book.status]} className="capitalize">
          {book.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      headerClassName: 'text-right',
      render: (book) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="!px-2"
            aria-label={`View ${book.title}`}
            title="View details"
            onClick={() => {
              setViewedBook(book);
              viewModal.open();
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="!px-2"
            aria-label={`Edit ${book.title}`}
            title="Edit"
            onClick={() => openEdit(book)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="!px-2"
            aria-label={`QR code for ${book.title}`}
            title="QR code"
            onClick={() => {
              setQrBook(book);
              qrModal.open();
            }}
          >
            <QrCode className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="!px-2"
            aria-label={`History for ${book.title}`}
            title="Borrowing history"
            onClick={() => {
              setHistoryBook(book);
              historyModal.open();
            }}
          >
            <History className="h-4 w-4" />
          </Button>
          {book.status === 'active' ? (
            <Button
              variant="ghost"
              size="sm"
              className="!px-2 text-red-600 hover:bg-red-50"
              aria-label={`Archive ${book.title}`}
              title="Archive"
              onClick={() => setArchiveTarget({ book, action: 'archive' })}
            >
              <Archive className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="!px-2 text-primary-700 hover:bg-primary-50"
              aria-label={`Restore ${book.title}`}
              title="Restore"
              onClick={() => setArchiveTarget({ book, action: 'restore' })}
            >
              <ArchiveRestore className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Book Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage the library catalog, availability, and condition.</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
          Add Book
        </Button>
      </div>

      <Card>
        <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex w-fit rounded-lg border border-gray-200 p-1">
            {(['active', 'archived'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors',
                  statusFilter === status ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100',
                )}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Search title or author…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
              containerClassName="sm:w-64"
            />
            <Select
              options={categories.map((c) => ({ label: c, value: c }))}
              placeholder="All categories"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              containerClassName="sm:w-48"
            />
          </div>
        </div>

        <div className="pt-4">
          <DataTable
            columns={columns}
            data={pageItems}
            keyField={(book) => book.id}
            emptyTitle="No books found"
            emptyDescription="Try adjusting your search or filters, or add a new book to the catalog."
          />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-4" />
        </div>
      </Card>

      <BookFormModal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        initialBook={editingBook ?? undefined}
        onSubmit={handleFormSubmit}
      />

      <BookHistoryModal isOpen={historyModal.isOpen} onClose={historyModal.close} book={historyBook} />

      <Modal isOpen={viewModal.isOpen} onClose={viewModal.close} title={viewedBook?.title ?? 'Book Details'} size="md">
        {viewedBook && (
          <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            {[
              ['Author', viewedBook.author],
              ['Category', viewedBook.category],
              ['Publisher', viewedBook.publisher],
              ['Publication Year', String(viewedBook.publicationYear)],
              ['Accession Number', viewedBook.accessionNumber],
              ['ISBN', viewedBook.isbn],
              ['Shelf Location', viewedBook.shelfLocation],
              ['Format', viewedBook.format],
              ['Quantity', String(viewedBook.quantity)],
              ['Available', String(viewedBook.available)],
              ['Condition', viewedBook.condition],
              ['Status', viewedBook.status],
              ['Added', formatDate(viewedBook.addedAt)],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
                <p className="text-sm text-gray-900">{value}</p>
              </div>
            ))}
            {viewedBook.description && (
              <div className="sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Description</p>
                <p className="text-sm text-gray-700">{viewedBook.description}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal isOpen={qrModal.isOpen} onClose={qrModal.close} title="Book QR Code" size="sm">
        {qrBook && (
          <div className="flex flex-col items-center gap-3 py-4">
            <QrPlaceholder value={qrBook.accessionNumber} />
            <p className="text-center text-sm text-gray-600">{qrBook.title}</p>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={archiveTarget !== null}
        title={archiveTarget?.action === 'archive' ? 'Archive this book?' : 'Restore this book?'}
        message={
          archiveTarget
            ? archiveTarget.action === 'archive'
              ? `"${archiveTarget.book.title}" will be moved to the archive and hidden from the member catalog.`
              : `"${archiveTarget.book.title}" will be restored and made available in the member catalog again.`
            : ''
        }
        confirmLabel={archiveTarget?.action === 'archive' ? 'Archive' : 'Restore'}
        variant={archiveTarget?.action === 'archive' ? 'danger' : 'default'}
        isLoading={isArchiving}
        onConfirm={handleConfirmArchive}
        onCancel={() => setArchiveTarget(null)}
      />
    </div>
  );
}
