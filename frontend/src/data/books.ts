import type { Book } from '../types';

// 20 active titles split 8/4/4/2/2 across category so the "Book Inventory by
// Category" donut lands on the exact 40/20/20/10/10% split from the spec.
// Plus one archived title to exercise the Active/Archived filter — archived
// books are excluded from both the Total Books count and the category split.
export const books: Book[] = [
  // Filipino Literature (8)
  { id: 'bk-1', title: 'Florante at Laura', author: 'Francisco Balagtas', category: 'Filipino Literature', isbn: '978-971-27-1234-0', quantity: 3, available: 2, condition: 'Good', status: 'active', coverColor: '#b45309' },
  { id: 'bk-2', title: 'Noli Me Tangere', author: 'Jose Rizal', category: 'Filipino Literature', isbn: '978-971-23-5678-1', quantity: 5, available: 3, condition: 'Excellent', status: 'active', coverColor: '#1f2937' },
  { id: 'bk-3', title: 'El Filibusterismo', author: 'Jose Rizal', category: 'Filipino Literature', isbn: '978-971-23-5679-8', quantity: 4, available: 0, condition: 'Good', status: 'active', coverColor: '#334155' },
  { id: 'bk-4', title: 'Ibong Adarna', author: 'Traditional Filipino Epic', category: 'Filipino Literature', isbn: '978-971-08-1122-3', quantity: 4, available: 3, condition: 'Good', status: 'active', coverColor: '#166534' },
  { id: 'bk-5', title: 'Mga Ibong Mandaragit', author: 'Amado V. Hernandez', category: 'Filipino Literature', isbn: '978-971-08-2233-4', quantity: 2, available: 1, condition: 'Fair', status: 'active', coverColor: '#7c2d12' },
  { id: 'bk-6', title: 'Banaag at Sikat', author: 'Lope K. Santos', category: 'Filipino Literature', isbn: '978-971-08-3344-5', quantity: 2, available: 2, condition: 'Good', status: 'active', coverColor: '#78350f' },
  { id: 'bk-7', title: "Dekada '70", author: 'Lualhati Bautista', category: 'Filipino Literature', isbn: '978-971-08-4455-6', quantity: 3, available: 1, condition: 'Excellent', status: 'active', coverColor: '#9a3412' },
  { id: 'bk-8', title: 'Mga Kuwento ni Lola Basyang', author: 'Severino Reyes', category: 'Filipino Literature', isbn: '978-971-08-5566-7', quantity: 3, available: 3, condition: 'Good', status: 'active', coverColor: '#a16207' },

  // Self-Help (4)
  { id: 'bk-9', title: 'The Power of Now', author: 'Eckhart Tolle', category: 'Self-Help', isbn: '978-1-57731-152-2', quantity: 2, available: 1, condition: 'Good', status: 'active', coverColor: '#0e7490' },
  { id: 'bk-10', title: 'Atomic Habits', author: 'James Clear', category: 'Self-Help', isbn: '978-0-7352-1129-2', quantity: 3, available: 2, condition: 'Excellent', status: 'active', coverColor: '#b91c1c' },
  { id: 'bk-11', title: 'The 7 Habits of Highly Effective People', author: 'Stephen Covey', category: 'Self-Help', isbn: '978-1-9821-9800-2', quantity: 2, available: 2, condition: 'Good', status: 'active', coverColor: '#065f46' },
  { id: 'bk-12', title: 'English Grammar Toolkit', author: 'Betty S. Azar', category: 'Self-Help', isbn: '978-0-13-406190-7', quantity: 3, available: 2, condition: 'Good', status: 'active', coverColor: '#1d4ed8' },

  // Science (4)
  { id: 'bk-13', title: 'A Brief History of Time', author: 'Stephen Hawking', category: 'Science', isbn: '978-0-553-38016-3', quantity: 2, available: 1, condition: 'Good', status: 'active', coverColor: '#312e81' },
  { id: 'bk-14', title: 'Cosmos', author: 'Carl Sagan', category: 'Science', isbn: '978-0-345-53943-5', quantity: 2, available: 2, condition: 'Excellent', status: 'active', coverColor: '#1e3a8a' },
  { id: 'bk-15', title: 'The Selfish Gene', author: 'Richard Dawkins', category: 'Science', isbn: '978-0-19-878493-8', quantity: 2, available: 1, condition: 'Fair', status: 'active', coverColor: '#3f6212' },
  { id: 'bk-16', title: 'Silent Spring', author: 'Rachel Carson', category: 'Science', isbn: '978-0-618-24906-0', quantity: 2, available: 2, condition: 'Good', status: 'active', coverColor: '#4d7c0f' },

  // Mathematics (2)
  { id: 'bk-17', title: 'Elementary Algebra', author: 'Harold R. Jacobs', category: 'Mathematics', isbn: '978-0-7167-1099-4', quantity: 2, available: 1, condition: 'Good', status: 'active', coverColor: '#7e22ce' },
  { id: 'bk-18', title: 'Geometry: A Comprehensive Course', author: 'Dan Pedoe', category: 'Mathematics', isbn: '978-0-486-65812-4', quantity: 2, available: 2, condition: 'Fair', status: 'active', coverColor: '#6d28d9' },

  // Story (2)
  { id: 'bk-19', title: 'The Little Prince', author: 'Antoine de Saint-Exupéry', category: 'Story', isbn: '978-0-15-601219-5', quantity: 3, available: 3, condition: 'Excellent', status: 'active', coverColor: '#be185d' },
  { id: 'bk-20', title: "Aesop's Fables", author: 'Aesop', category: 'Story', isbn: '978-0-8109-5490-3', quantity: 2, available: 2, condition: 'Good', status: 'active', coverColor: '#a21caf' },

  // Archived (excluded from stats)
  { id: 'bk-21', title: 'Physics Made Simple', author: 'Rex Bookstore Staff', category: 'Science', isbn: '978-971-23-9999-9', quantity: 2, available: 0, condition: 'Worn', status: 'archived', coverColor: '#57534e' },
];

export function findBookById(id: string): Book | undefined {
  return books.find((b) => b.id === id);
}
