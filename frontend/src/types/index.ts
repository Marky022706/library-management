export type RoleName = 'Super Admin' | 'Admin' | 'Librarian' | 'Member';

export interface Role {
  role_id: number;
  role_name: RoleName;
}

export interface LibraryCard {
  card_id: number;
  user_id: number;
  qr_code_value: string;
  issued_date: string;
  card_status: 'Active' | 'Lost' | 'Expired' | 'Revoked';
}

export interface User {
  user_id: number;
  role_id: number;
  school_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  account_status: 'Active' | 'Suspended' | 'Inactive';
  created_at: string;
  role?: Role;
  library_card?: LibraryCard;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}
