export type UserRole = 'member' | 'admin' | 'superadmin';

export type UserStatus = 'pending' | 'active' | 'inactive' | 'suspended';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  libraryCardId: string;
  registeredAt: string;
  lastLoginAt?: string;
}

export function fullName(user: Pick<User, 'firstName' | 'lastName'>): string {
  return `${user.firstName} ${user.lastName}`.trim();
}
