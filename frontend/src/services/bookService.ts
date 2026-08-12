import type { Book, BookInput } from '@/types';
import { mockBooks } from '@/mock';
import { generateId } from '@/utils/id';
import { isoDate } from '@/utils/date';
import { wait } from '@/utils/wait';

let books: Book[] = [...mockBooks];

export async function getAll(): Promise<Book[]> {
  await wait();
  return books;
}

export async function add(input: BookInput): Promise<Book> {
  await wait();
  const newBook: Book = {
    ...input,
    id: generateId('b'),
    available: input.quantity,
    status: 'active',
    addedAt: isoDate(new Date()),
  };
  books = [newBook, ...books];
  return newBook;
}

export async function update(id: string, patch: Partial<BookInput>): Promise<Book> {
  await wait();
  let updated: Book | undefined;
  books = books.map((book) => {
    if (book.id !== id) return book;
    updated = { ...book, ...patch };
    return updated;
  });
  if (!updated) throw new Error('Book not found.');
  return updated;
}

export async function setStatus(id: string, status: Book['status']): Promise<Book> {
  await wait();
  let updated: Book | undefined;
  books = books.map((book) => {
    if (book.id !== id) return book;
    updated = { ...book, status };
    return updated;
  });
  if (!updated) throw new Error('Book not found.');
  return updated;
}

/** Adjust the number of copies currently available (e.g. -1 when borrowed, +1 when returned). */
export async function adjustAvailability(id: string, delta: number): Promise<Book> {
  await wait(120);
  let updated: Book | undefined;
  books = books.map((book) => {
    if (book.id !== id) return book;
    const available = Math.max(0, Math.min(book.quantity, book.available + delta));
    updated = { ...book, available };
    return updated;
  });
  if (!updated) throw new Error('Book not found.');
  return updated;
}
