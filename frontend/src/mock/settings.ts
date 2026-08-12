import type { LibrarySettings } from '@/types';

export const mockSettings: LibrarySettings = {
  maxBooksPerMember: 3,
  loanDurationDays: 7,
  reservationDurationDays: 3,
  operatingHours: {
    open: '08:00',
    close: '17:00',
    daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  },
};
