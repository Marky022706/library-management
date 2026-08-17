import type { User } from '../types';

// Exactly 4 active members (Maria, Carlos, Miguel, Lucia) — matches the
// "Members" dashboard stat. Ana (pending) and Rosa (suspended) round out the
// User Management table so the role/status filters have something to do.
export const users: User[] = [
  {
    id: 'u-1',
    name: 'Maria Santos',
    firstName: 'Maria',
    lastName: 'Santos',
    email: 'member@library.test',
    username: 'mariasantos',
    role: 'member',
    status: 'active',
    registeredAt: '2024-01-15',
    studentId: '2024-01092',
    school: 'State University Institute of Technology',
    course: 'BS Computer Science',
    yearLevel: '3rd Year',
    contactNumber: '09171234567',
    address: 'Poblacion, Balingasag, Misamis Oriental',
    libraryCardNumber: 'LIB-U-1-2026',
    qrCodeData: 'LIB-U-1-2026',
    termsAgreed: true,
    infoAccurateConfirmed: true,
  },
  { id: 'u-2', name: 'Jose Reyes', email: 'admin@library.test', role: 'admin', status: 'active', registeredAt: '2023-06-01' },
  { id: 'u-3', name: 'Elena Cruz', email: 'superadmin@library.test', role: 'superadmin', status: 'active', registeredAt: '2023-01-01' },
  { id: 'u-4', name: 'Pedro Dela Cruz', email: 'pedro@library.test', role: 'admin', status: 'active', registeredAt: '2024-02-10' },
  {
    id: 'u-5',
    name: 'Ana Gonzales',
    firstName: 'Ana',
    lastName: 'Gonzales',
    email: 'ana@library.test',
    username: 'anagonzales',
    role: 'member',
    status: 'pending',
    registeredAt: '2024-07-20',
    studentId: '2024-04812',
    school: 'Balingasag College of Education',
    course: 'BS Information Technology',
    yearLevel: '2nd Year',
    gender: 'Female',
    contactNumber: '09289876543',
    address: 'Hermano, Balingasag, Misamis Oriental',
    termsAgreed: true,
    infoAccurateConfirmed: true,
  },
  {
    id: 'u-6',
    name: 'Carlos Villanueva',
    firstName: 'Carlos',
    lastName: 'Villanueva',
    email: 'carlos@library.test',
    username: 'carlosv',
    role: 'member',
    status: 'active',
    registeredAt: '2024-03-05',
    studentId: '2024-03319',
    school: 'State University Institute of Technology',
    course: 'BS Business Administration',
    yearLevel: '4th Year',
    libraryCardNumber: 'LIB-U-6-2026',
    qrCodeData: 'LIB-U-6-2026',
  },
  { id: 'u-7', name: 'Rosa Mendoza', email: 'rosa@library.test', role: 'member', status: 'suspended', registeredAt: '2024-04-18' },
  { id: 'u-8', name: 'Carmen Bautista', email: 'carmen@library.test', role: 'admin', status: 'active', registeredAt: '2023-09-12' },
  {
    id: 'u-9',
    name: 'Miguel Torres',
    firstName: 'Miguel',
    lastName: 'Torres',
    email: 'miguel@library.test',
    role: 'member',
    status: 'active',
    registeredAt: '2024-05-22',
    studentId: '2024-07114',
    school: 'Balingasag National High School',
    course: 'STEM Strand - Grade 12',
    yearLevel: 'Grade 12',
    libraryCardNumber: 'LIB-U-9-2026',
    qrCodeData: 'LIB-U-9-2026',
  },
  { id: 'u-10', name: 'Lucia Ramos', email: 'lucia@library.test', role: 'member', status: 'active', registeredAt: '2024-06-30' },
];

export function findUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function userDisplayName(id: string): string {
  return findUserById(id)?.name ?? 'Unknown user';
}
