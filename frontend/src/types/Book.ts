export type BookFormat = 'Hardcover' | 'Paperback' | 'E-Book' | 'Audiobook';

export type BookCondition = 'New' | 'Good' | 'Fair' | 'Worn' | 'Damaged';

export type BookStatus = 'active' | 'archived';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  publisher: string;
  publicationYear: number;
  accessionNumber: string;
  isbn: string;
  shelfLocation: string;
  format: BookFormat;
  quantity: number;
  available: number;
  condition: BookCondition;
  status: BookStatus;
  coverUrl?: string;
  description?: string;
  addedAt: string;
}

export type BookInput = Omit<Book, 'id' | 'available' | 'status' | 'addedAt'>;
