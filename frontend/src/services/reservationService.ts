import type { Reservation } from '@/types';
import { mockReservations } from '@/mock';
import { generateId } from '@/utils/id';
import { isoDate, daysFromNow } from '@/utils/date';
import { wait } from '@/utils/wait';

let reservations: Reservation[] = [...mockReservations];

export async function getAll(): Promise<Reservation[]> {
  await wait();
  return reservations;
}

export interface CreateReservationInput {
  userId: string;
  bookId: string;
  /** Reservation window in days, sourced from the (possibly admin-edited) library settings. */
  durationDays: number;
}

export async function create(input: CreateReservationInput): Promise<Reservation> {
  await wait();
  const newReservation: Reservation = {
    id: generateId('r'),
    userId: input.userId,
    bookId: input.bookId,
    reservedDate: isoDate(new Date()),
    expiryDate: daysFromNow(input.durationDays),
    status: 'pending',
  };
  reservations = [newReservation, ...reservations];
  return newReservation;
}

async function setStatus(id: string, status: Reservation['status']): Promise<Reservation> {
  await wait();
  let updated: Reservation | undefined;
  reservations = reservations.map((reservation) => {
    if (reservation.id !== id) return reservation;
    updated = { ...reservation, status };
    return updated;
  });
  if (!updated) throw new Error('Reservation not found.');
  return updated;
}

export async function cancel(id: string): Promise<Reservation> {
  return setStatus(id, 'cancelled');
}

export async function markReady(id: string): Promise<Reservation> {
  return setStatus(id, 'ready');
}

export async function fulfill(id: string): Promise<Reservation> {
  return setStatus(id, 'fulfilled');
}
