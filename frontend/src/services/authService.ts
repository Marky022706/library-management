import type { User, UserRole } from '@/types';
import { mockUsers } from '@/mock';
import { generateId } from '@/utils/id';
import { isoDate } from '@/utils/date';
import { wait } from '@/utils/wait';

/**
 * Frontend-only auth service. Every mock account shares the password "password".
 * When the PHP/MySQL backend is ready, swap the bodies below for real API calls —
 * callers already `await` these functions, so no call-site changes will be needed.
 */
const MOCK_PASSWORD = 'password';

let directory: User[] = [...mockUsers];

export async function login(email: string, password: string): Promise<User> {
  await wait();
  const user = directory.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) throw new Error('No account found with that email address.');
  if (password !== MOCK_PASSWORD) throw new Error('Incorrect password.');
  if (user.status === 'suspended') throw new Error('This account has been suspended. Please contact the library.');
  if (user.status === 'inactive') throw new Error('This account is inactive. Please contact the library.');
  user.lastLoginAt = isoDate(new Date());
  directory = directory.map((u) => (u.id === user.id ? user : u));
  return user;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

export async function register(input: RegisterInput): Promise<User> {
  await wait();
  if (directory.some((u) => u.email.toLowerCase() === input.email.trim().toLowerCase())) {
    throw new Error('An account with that email already exists.');
  }
  const newUser: User = {
    id: generateId('u'),
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone,
    address: input.address,
    role: 'member',
    status: 'pending',
    libraryCardId: `BPL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    registeredAt: isoDate(new Date()),
  };
  directory = [...directory, newUser];
  return newUser;
}

export async function requestPasswordReset(email: string): Promise<void> {
  await wait();
  const user = directory.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) throw new Error('No account found with that email address.');
  // Real password-reset email delivery will be implemented with the backend.
}

export function roleHomePath(role: UserRole): string {
  return role === 'member' ? '/member/dashboard' : '/admin/dashboard';
}
