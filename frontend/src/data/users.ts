import type { User } from '../types';

// Exactly 4 active members (Maria, Carlos, Miguel, Lucia) — matches the
// "Members" dashboard stat. Ana (pending) and Rosa (suspended) round out the
// User Management table so the role/status filters have something to do.
export const users: User[] = [
  { id: 'u-1', name: 'Maria Santos', email: 'member@library.test', role: 'member', status: 'active', registeredAt: '2024-01-15' },
  { id: 'u-2', name: 'Jose Reyes', email: 'admin@library.test', role: 'admin', status: 'active', registeredAt: '2023-06-01' },
  { id: 'u-3', name: 'Elena Cruz', email: 'superadmin@library.test', role: 'superadmin', status: 'active', registeredAt: '2023-01-01' },
  { id: 'u-4', name: 'Pedro Dela Cruz', email: 'pedro@library.test', role: 'admin', status: 'active', registeredAt: '2024-02-10' },
  { id: 'u-5', name: 'Ana Gonzales', email: 'ana@library.test', role: 'member', status: 'pending', registeredAt: '2024-07-20' },
  { id: 'u-6', name: 'Carlos Villanueva', email: 'carlos@library.test', role: 'member', status: 'active', registeredAt: '2024-03-05' },
  { id: 'u-7', name: 'Rosa Mendoza', email: 'rosa@library.test', role: 'member', status: 'suspended', registeredAt: '2024-04-18' },
  { id: 'u-8', name: 'Carmen Bautista', email: 'carmen@library.test', role: 'admin', status: 'active', registeredAt: '2023-09-12' },
  { id: 'u-9', name: 'Miguel Torres', email: 'miguel@library.test', role: 'member', status: 'active', registeredAt: '2024-05-22' },
  { id: 'u-10', name: 'Lucia Ramos', email: 'lucia@library.test', role: 'member', status: 'active', registeredAt: '2024-06-30' },
];

export function findUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function userDisplayName(id: string): string {
  return findUserById(id)?.name ?? 'Unknown user';
}
