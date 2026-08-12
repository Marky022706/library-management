import type { User, UserRole, UserStatus } from '@/types';
import { mockUsers } from '@/mock';
import { wait } from '@/utils/wait';

let users: User[] = [...mockUsers];

export async function getAll(): Promise<User[]> {
  await wait();
  return users;
}

export async function update(id: string, patch: Partial<User>): Promise<User> {
  await wait();
  let updated: User | undefined;
  users = users.map((user) => {
    if (user.id !== id) return user;
    updated = { ...user, ...patch };
    return updated;
  });
  if (!updated) throw new Error('User not found.');
  return updated;
}

export async function updateStatus(id: string, status: UserStatus): Promise<User> {
  return update(id, { status });
}

export async function assignRole(id: string, role: UserRole): Promise<User> {
  return update(id, { role });
}
