export type RequestType = 'Borrowing' | 'Archive' | 'Acquisition';

export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface LibraryRequest {
  id: string;
  type: RequestType;
  requesterId: string;
  bookId?: string;
  bookTitle?: string;
  /** Set when type === 'Borrowing' — links this request to its underlying Borrowing record. */
  borrowingId?: string;
  details: string;
  date: string;
  status: RequestStatus;
  approverId?: string;
  resolvedDate?: string;
}
