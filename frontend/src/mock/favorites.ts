import type { Favorite } from '@/types';
import { daysAgo } from '@/utils/date';

export const mockFavorites: Favorite[] = [
  { id: 'fav1', userId: 'u3', bookId: 'b9', addedAt: daysAgo(3) },
  { id: 'fav2', userId: 'u3', bookId: 'b12', addedAt: daysAgo(20) },
  { id: 'fav3', userId: 'u3', bookId: 'b5', addedAt: daysAgo(6) },
  { id: 'fav4', userId: 'u4', bookId: 'b14', addedAt: daysAgo(10) },
  { id: 'fav5', userId: 'u8', bookId: 'b9', addedAt: daysAgo(3) },
];
