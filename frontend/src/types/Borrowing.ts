export type BorrowingStatus = 'pending' | 'active' | 'returned' | 'overdue' | 'rejected';

export interface Borrowing {
  id: string;
  bookId: string;
  userId: string;
  requestedDate: string;
  borrowedDate?: string;
  dueDate: string;
  returnedDate?: string;
  status: BorrowingStatus;
  idDocumentName?: string;
}
