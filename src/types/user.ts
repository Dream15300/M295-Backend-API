export type UserRole = 'employee' | 'admin';

export interface User {
  id: number;
  username: string;
  password_hash: string;
  role: UserRole;
  created_at: string;
}

export interface UserPublic {
  id: number;
  username: string;
  role: UserRole;
}
