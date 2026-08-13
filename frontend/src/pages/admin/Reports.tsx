import { useMemo } from 'react';
import { BarChart3, Download } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { BorrowingChart } from '../../components/dashboard/BorrowingChart';
import { CategoryChart } from '../../components/dashboard/CategoryChart';
import { EmptyState } from '../../components/common/EmptyState';
import { useLibraryData } from '../../context/LibraryDataContext';
import { useToast } from '../../context/ToastContext';
import { findBookById } from '../../data/books';

export function Reports() {
  const { books, requests } = useLibraryData();
  const { showToast } = useToast();

  const topBorrowed = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of requests) {
      if (r.type !== 'borrowing' || !r.bookId) continue;
      counts.set(r.bookId, (counts.get(r.bookId) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([bookId, count]) => ({ book: findBookById(bookId), count }))
      .filter((row) => row.book)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [requests]);

  const handleExportCsv = () => {
    const header = ['Title', 'Author', 'Category', 'ISBN', 'Quantity', 'Available', 'Condition', 'Status'];
    const rows = books.map((b) => [b.title, b.author, b.category, b.isbn, b.quantity, b.available, b.condition, b.status]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'balingasag-library-catalog.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Catalog exported as CSV.');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Reports</h1>
          <p className="mt-1 text-sm text-muted">Circulation trends and catalog exports.</p>
        </div>
        <Button icon={<Download className="h-4 w-4" aria-hidden="true" />} onClick={handleExportCsv}>
          Export Catalog (CSV)
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <Card title="Monthly Borrowing Trends">
          <BorrowingChart />
        </Card>
        <Card title="Book Inventory by Category">
          <CategoryChart />
        </Card>
      </div>

      <Card title="Top Borrowed Books" subtitle="Ranked by number of borrowing requests on record">
        {topBorrowed.length === 0 ? (
          <EmptyState icon={BarChart3} title="No borrowing activity yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs font-semibold uppercase tracking-wide text-muted">
                  <th className="py-3 pr-4">Book</th>
                  <th className="py-3 pr-4">Category</th>
                  <th className="py-3 pr-0 text-right">Times Borrowed</th>
                </tr>
              </thead>
              <tbody>
                {topBorrowed.map(({ book, count }) => (
                  <tr key={book!.id} className="border-b border-line last:border-0">
                    <td className="py-3 pr-4 font-medium text-ink">{book!.title}</td>
                    <td className="py-3 pr-4 text-muted">{book!.category}</td>
                    <td className="py-3 pr-0 text-right text-ink">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
