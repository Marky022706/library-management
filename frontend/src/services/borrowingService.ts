import type { Borrowing } from '@/types';
import { mockBorrowings } from '@/mock';
import { generateId } from '@/utils/id';
import { isoDate } from '@/utils/date';
import { wait } from '@/utils/wait';

let borrowings: Borrowing[] = [...mockBorrowings];

export async function getAll(): Promise<Borrowing[]> {
  await wait();
  return borrowings;
}

export interface CreateBorrowingInput {
  userId: string;
  bookId: string;
  dueDate: string;
  idDocumentName?: string;
}

export async function create(input: CreateBorrowingInput): Promise<Borrowing> {
  await wait();
  const newBorrowing: Borrowing = {
    id: generateId('bw'),
    userId: input.userId,
    bookId: input.bookId,
    requestedDate: isoDate(new Date()),
    dueDate: input.dueDate,
    idDocumentName: input.idDocumentName,
    status: 'pending',
  };
  borrowings = [newBorrowing, ...borrowings];
  return newBorrowing;
}

async function setStatus(id: string, patch: Partial<Borrowing>): Promise<Borrowing> {
  await wait();
  let updated: Borrowing | undefined;
  borrowings = borrowings.map((borrowing) => {
    if (borrowing.id !== id) return borrowing;
    updated = { ...borrowing, ...patch };
    return updated;
  });
  if (!updated) throw new Error('Borrowing record not found.');
  return updated;
}

export async function approve(id: string): Promise<Borrowing> {
  return setStatus(id, { status: 'active', borrowedDate: isoDate(new Date()) });
}

export async function reject(id: string): Promise<Borrowing> {
  return setStatus(id, { status: 'rejected' });
}

export async function returnBook(id: string): Promise<Borrowing> {
  return setStatus(id, { status: 'returned', returnedDate: isoDate(new Date()) });
}

export async function markOverdue(id: string): Promise<Borrowing> {
  return setStatus(id, { status: 'overdue' });
}
