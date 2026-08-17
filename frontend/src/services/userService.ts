import { request, type ApiResponse } from './api';
import type { User, UserStatus } from '../types';

export interface RegisterMemberInput {
  name: string;
  email: string;
  password?: string;
  username?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  contactNumber?: string;
  address?: string;
  studentId?: string;
  school?: string;
  course?: string;
  yearLevel?: string;
  schoolIdUrl?: string;
  profilePhotoUrl?: string;
  termsAgreed?: boolean;
  infoAccurateConfirmed?: boolean;
}

export const userService = {
  async register(input: RegisterMemberInput): Promise<ApiResponse<{ user: User }>> {
    return request('/api/auth.php?action=register', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async createUser(input: Partial<User> & { password?: string; student_id?: string; year_level?: string; phone?: string }): Promise<ApiResponse<{ user: User }>> {
    return request('/api/users.php', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async login(emailOrUsername: string, password: string): Promise<ApiResponse<{ user: User; token: string; role: string }>> {
    return request('/api/auth.php?action=login', {
      method: 'POST',
      body: JSON.stringify({ email: emailOrUsername, password }),
    });
  },

  async logout(): Promise<ApiResponse> {
    return request('/api/auth.php?action=logout', { method: 'POST' });
  },

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    return request('/api/auth.php?action=me');
  },

  async getUsers(params: { role?: string; status?: string; search?: string } = {}): Promise<ApiResponse<{ users: User[]; total: number }>> {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return request(`/api/users.php?${query}`);
  },

  async getUserById(id: string): Promise<ApiResponse<{ user: User }>> {
    return request(`/api/users.php?id=${id}`);
  },

  async updateUser(id: string, patch: Partial<User>): Promise<ApiResponse<{ user: User }>> {
    return request(`/api/users.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(patch),
    });
  },

  async setUserStatus(id: string, status: UserStatus): Promise<ApiResponse<{ user: User }>> {
    return request(`/api/users.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  async deactivateUser(id: string): Promise<ApiResponse> {
    return request(`/api/users.php?id=${id}`, { method: 'DELETE' });
  },
};
