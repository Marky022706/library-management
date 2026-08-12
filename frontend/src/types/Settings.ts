export interface LibraryOperatingHours {
  open: string;
  close: string;
  daysOpen: string[];
}

export interface LibrarySettings {
  maxBooksPerMember: number;
  loanDurationDays: number;
  reservationDurationDays: number;
  operatingHours: LibraryOperatingHours;
}
